package services_test

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/security"
	"backend/internal/services"

	_ "github.com/lib/pq"
)

// openTestDB opens a connection to the real NeonDB instance via DATABASE_URL env var.
// Tests are skipped if the variable is not set.
func openTestDB(t *testing.T) *sql.DB {
	t.Helper()
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		t.Skip("DATABASE_URL not set, skipping integration race tests")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatalf("openTestDB: sql.Open: %v", err)
	}
	db.SetMaxOpenConns(40)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)
	if err := db.PingContext(context.Background()); err != nil {
		t.Fatalf("openTestDB: ping failed: %v", err)
	}
	return db
}

// generateTestJWT creates a short-lived operator JWT for tests.
func generateTestJWT(t *testing.T) string {
	t.Helper()
	// Ensure JWT_SECRET is set so GenerateAccessToken uses the same secret as the server.
	if os.Getenv("JWT_SECRET") == "" {
		t.Setenv("JWT_SECRET", "test_jwt_secret_for_race_tests_only")
	}
	user := &models.User{
		ID:     "00000000-0000-0000-0000-000000000001",
		Email:  "operator@test.local",
		Name:   "Test Operator",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	token, _, err := security.GenerateAccessToken(user)
	if err != nil {
		t.Fatalf("generateTestJWT: %v", err)
	}
	return token
}

// insertTestTicket inserts a VENDIDO ticket directly into the DB and returns its public_token.
// The ticket is cleaned up via t.Cleanup.
func insertTestTicket(t *testing.T, db *sql.DB, ticketType models.TicketType) string {
	t.Helper()
	ctx := context.Background()

	// Insert a minimal buyer
	var buyerID string
	err := db.QueryRowContext(ctx, `
		INSERT INTO buyers (id, first_name, last_name, phone, email, created_at)
		VALUES (gen_random_uuid(), 'Race', 'Tester', '0000000000', $1, NOW())
		RETURNING id
	`, fmt.Sprintf("race.test.%d@test.local", time.Now().UnixNano())).Scan(&buyerID)
	if err != nil {
		t.Fatalf("insertTestTicket: insert buyer: %v", err)
	}

	// Use the initial admin seller ID or fall back to a placeholder that must exist in the DB.
	sellerID := os.Getenv("TEST_SELLER_ID")
	if sellerID == "" {
		err = db.QueryRowContext(ctx, `SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`).Scan(&sellerID)
		if err != nil {
			t.Fatalf("insertTestTicket: fetch seller: %v", err)
		}
	}

	publicToken := fmt.Sprintf("race-test-token-%d", time.Now().UnixNano())
	code := fmt.Sprintf("%04d", time.Now().UnixNano()%10000)

	var ticketID string
	err = db.QueryRowContext(ctx, `
		INSERT INTO tickets (
			id, public_token, four_digit_code, ticket_type, sale_source,
			price_paid, status, buyer_id, seller_id, created_at, updated_at
		) VALUES (
			gen_random_uuid(), $1, $2, $3, 'PUERTA',
			1000.00, 'VENDIDO', $4, $5, NOW(), NOW()
		) RETURNING id
	`, publicToken, code, ticketType, buyerID, sellerID).Scan(&ticketID)
	if err != nil {
		t.Fatalf("insertTestTicket: insert ticket: %v", err)
	}

	t.Cleanup(func() {
		db.ExecContext(context.Background(), `DELETE FROM ticket_validations WHERE ticket_id = $1`, ticketID)
		db.ExecContext(context.Background(), `DELETE FROM tickets WHERE id = $1`, ticketID)
		db.ExecContext(context.Background(), `DELETE FROM buyers WHERE id = $1`, buyerID)
	})

	return publicToken
}

// TestDoubleValidateEntry verifies that N concurrent goroutines validating
// the same ticket produce exactly one HTTP-200-equivalent success and the
// rest receive an ErrInvalidStatusTransition conflict.
func TestDoubleValidateEntry(t *testing.T) {
	db := openTestDB(t)
	defer db.Close()

	ticketRepo := repository.NewTicketRepository(db)
	quotaRepo := repository.NewQuotaRepository(db)
	priceRepo := repository.NewPriceRepository(db)
	userRepo := repository.NewUserRepository(db)
	svc := services.NewTicketService(ticketRepo, quotaRepo, priceRepo, userRepo)

	publicToken := insertTestTicket(t, db, models.TicketTypeConComida)
	operatorID := "00000000-0000-0000-0000-000000000001"

	const concurrency = 10
	var successes int64
	var conflicts int64

	var wg sync.WaitGroup
	barrier := make(chan struct{})

	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-barrier // all goroutines start simultaneously
			_, err := svc.ValidateTicket(context.Background(), operatorID, &dto.ValidateTicketRequest{
				PublicToken:    publicToken,
				ValidationType: models.ValidationTypeEntrada,
			})
			if err == nil {
				atomic.AddInt64(&successes, 1)
			} else {
				atomic.AddInt64(&conflicts, 1)
			}
		}()
	}

	close(barrier) // release all goroutines at once
	wg.Wait()

	if successes != 1 {
		t.Errorf("expected exactly 1 successful validation, got %d", successes)
	}
	if conflicts != concurrency-1 {
		t.Errorf("expected %d conflicts, got %d", concurrency-1, conflicts)
	}
}

// TestDoubleValidateFood verifies that a ticket with status USADO_ENTRADA
// cannot be double-consumed for food under concurrent load.
func TestDoubleValidateFood(t *testing.T) {
	db := openTestDB(t)
	defer db.Close()

	ticketRepo := repository.NewTicketRepository(db)
	quotaRepo := repository.NewQuotaRepository(db)
	priceRepo := repository.NewPriceRepository(db)
	userRepo := repository.NewUserRepository(db)
	svc := services.NewTicketService(ticketRepo, quotaRepo, priceRepo, userRepo)

	publicToken := insertTestTicket(t, db, models.TicketTypeConComida)
	operatorID := "00000000-0000-0000-0000-000000000001"

	// First: advance status to USADO_ENTRADA so food validation is valid.
	_, err := svc.ValidateTicket(context.Background(), operatorID, &dto.ValidateTicketRequest{
		PublicToken:    publicToken,
		ValidationType: models.ValidationTypeEntrada,
	})
	if err != nil {
		t.Fatalf("setup: entry validation failed: %v", err)
	}

	const concurrency = 10
	var successes int64
	var conflicts int64

	var wg sync.WaitGroup
	barrier := make(chan struct{})

	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-barrier
			_, err := svc.ValidateTicket(context.Background(), operatorID, &dto.ValidateTicketRequest{
				PublicToken:    publicToken,
				ValidationType: models.ValidationTypeComida,
			})
			if err == nil {
				atomic.AddInt64(&successes, 1)
			} else {
				atomic.AddInt64(&conflicts, 1)
			}
		}()
	}

	close(barrier)
	wg.Wait()

	if successes != 1 {
		t.Errorf("expected exactly 1 food validation success, got %d", successes)
	}
	if conflicts != concurrency-1 {
		t.Errorf("expected %d conflicts for food, got %d", concurrency-1, conflicts)
	}
}

// generateTestJWT is called here only to keep it referenced in this file.
var _ = generateTestJWT
