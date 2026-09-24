package repository

import (
	"context"
	"errors"
	"testing"
	"time"

	"backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestTicketRepository_CreateBuyerTx(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := repo.BeginTx(ctx)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	email := "juan@example.com"
	buyer := &models.Buyer{
		FirstName: "Juan",
		LastName:  "Perez",
		Phone:     "+549351123456",
		Email:     &email,
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "created_at"}).AddRow("buyer-uuid-1", now)
	mock.ExpectQuery(`INSERT INTO buyers`).
		WithArgs(buyer.FirstName, buyer.LastName, buyer.Phone, buyer.Email).
		WillReturnRows(rows)

	err = repo.CreateBuyerTx(ctx, tx, buyer)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if buyer.ID != "buyer-uuid-1" {
		t.Errorf("expected buyer-uuid-1, got %s", buyer.ID)
	}
}

func TestTicketRepository_CreateBuyer(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	email := "maria@example.com"
	buyer := &models.Buyer{
		FirstName: "Maria",
		LastName:  "Gomez",
		Phone:     "+549351987654",
		Email:     &email,
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "created_at"}).AddRow("buyer-uuid-2", now)
	mock.ExpectQuery(`INSERT INTO buyers`).
		WithArgs(buyer.FirstName, buyer.LastName, buyer.Phone, buyer.Email).
		WillReturnRows(rows)

	err = repo.CreateBuyer(ctx, buyer)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if buyer.ID != "buyer-uuid-2" {
		t.Errorf("expected buyer-uuid-2, got %s", buyer.ID)
	}
}

func TestTicketRepository_CreateTicketTx(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := repo.BeginTx(ctx)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	ticket := &models.Ticket{
		PublicToken:   "pubtok123",
		FourDigitCode: "1234",
		TicketType:    models.TicketTypeSimple,
		SaleSource:    models.SaleSourceAnticipada,
		QuotaSource:   models.QuotaSourcePersonal,
		PricePaid:     3000.0,
		Status:        models.TicketStatusVendido,
		BuyerID:       "buyer-1",
		SellerID:      "seller-1",
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "ticket_number", "created_at", "updated_at"}).
		AddRow("ticket-uuid-1", 101, now, now)

	mock.ExpectQuery(`INSERT INTO tickets`).
		WithArgs(
			ticket.PublicToken, ticket.FourDigitCode, ticket.TicketType,
			ticket.SaleSource, ticket.QuotaSource, ticket.PricePaid,
			ticket.Status, ticket.BuyerID, ticket.SellerID,
		).WillReturnRows(rows)

	err = repo.CreateTicketTx(ctx, tx, ticket)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if ticket.ID != "ticket-uuid-1" || ticket.TicketNumber != 101 {
		t.Errorf("expected ticket-uuid-1 and 101, got %s and %d", ticket.ID, ticket.TicketNumber)
	}
}

func TestTicketRepository_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"id", "ticket_number", "public_token", "four_digit_code", "ticket_type",
		"sale_source", "quota_source", "price_paid", "status", "buyer_id", "seller_id",
		"created_at", "updated_at",
		"first_name", "last_name", "phone", "email",
		"seller_name", "seller_email",
		"entry_validated_at", "entry_validator_name",
		"food_validated_at", "food_validator_name",
	}).AddRow(
		"ticket-uuid-1", 101, "tok123", "9999", models.TicketTypeSimple,
		models.SaleSourceAnticipada, models.QuotaSourcePersonal, 3000.0, models.TicketStatusVendido, "b1", "s1",
		now, now,
		"Carlos", "Buyer", "+54911000", "buyer@example.com",
		"Vendedor Admin", "seller@example.com",
		nil, nil,
		nil, nil,
	)

	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t`).
		WithArgs("ticket-uuid-1").
		WillReturnRows(rows)

	tObj, err := repo.GetByID(ctx, "ticket-uuid-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tObj.ID != "ticket-uuid-1" || tObj.Buyer.FirstName != "Carlos" {
		t.Errorf("unexpected ticket data retrieved: %v", tObj)
	}
}

func TestTicketRepository_GetByPublicToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"id", "ticket_number", "public_token", "four_digit_code", "ticket_type",
		"sale_source", "quota_source", "price_paid", "status", "buyer_id", "seller_id",
		"created_at", "updated_at",
		"first_name", "last_name", "phone", "email",
		"seller_name", "seller_email",
		"entry_validated_at", "entry_validator_name",
		"food_validated_at", "food_validator_name",
	}).AddRow(
		"ticket-uuid-1", 101, "tok123", "9999", models.TicketTypeSimple,
		models.SaleSourceAnticipada, models.QuotaSourcePersonal, 3000.0, models.TicketStatusVendido, "b1", "s1",
		now, now,
		"Carlos", "Buyer", "+54911000", "buyer@example.com",
		"Vendedor Admin", "seller@example.com",
		nil, nil,
		nil, nil,
	)

	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t`).
		WithArgs("tok123").
		WillReturnRows(rows)

	tObj, err := repo.GetByPublicToken(ctx, "tok123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tObj.PublicToken != "tok123" {
		t.Errorf("expected public_token tok123, got %s", tObj.PublicToken)
	}
}

func TestTicketRepository_GetBy4DigitCode(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"id", "ticket_number", "public_token", "four_digit_code", "ticket_type",
		"sale_source", "quota_source", "price_paid", "status", "buyer_id", "seller_id",
		"created_at", "updated_at",
		"first_name", "last_name", "phone", "email",
		"seller_name", "seller_email",
		"entry_validated_at", "entry_validator_name",
		"food_validated_at", "food_validator_name",
	}).AddRow(
		"ticket-uuid-1", 101, "tok123", "9999", models.TicketTypeSimple,
		models.SaleSourceAnticipada, models.QuotaSourcePersonal, 3000.0, models.TicketStatusVendido, "b1", "s1",
		now, now,
		"Carlos", "Buyer", "+54911000", "buyer@example.com",
		"Vendedor Admin", "seller@example.com",
		nil, nil,
		nil, nil,
	)

	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t`).
		WithArgs("9999").
		WillReturnRows(rows)

	tObj, err := repo.GetBy4DigitCode(ctx, "9999")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tObj.FourDigitCode != "9999" {
		t.Errorf("expected 4digit code 9999, got %s", tObj.FourDigitCode)
	}
}

func TestTicketRepository_Is4DigitCodeExists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	rows := sqlmock.NewRows([]string{"exists"}).AddRow(true)
	mock.ExpectQuery(`SELECT EXISTS`).WithArgs("8888").WillReturnRows(rows)

	exists, err := repo.Is4DigitCodeExists(ctx, "8888")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !exists {
		t.Errorf("expected true, got false")
	}
}

func TestTicketRepository_UpdateStatusConditionalTx(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := repo.BeginTx(ctx)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	// 1. Success case: 1 row affected
	mock.ExpectExec(`UPDATE tickets SET status = \$1`).
		WithArgs(models.TicketStatusUsadoEntrada, "ticket-uuid-1", models.TicketStatusVendido).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.UpdateStatusConditionalTx(ctx, tx, "ticket-uuid-1", models.TicketStatusVendido, models.TicketStatusUsadoEntrada)
	if err != nil {
		t.Fatalf("expected success, got %v", err)
	}

	// 2. Conflict case: 0 rows affected (concurrent modification)
	mock.ExpectExec(`UPDATE tickets SET status = \$1`).
		WithArgs(models.TicketStatusUsadoEntrada, "ticket-uuid-1", models.TicketStatusVendido).
		WillReturnResult(sqlmock.NewResult(0, 0))

	err = repo.UpdateStatusConditionalTx(ctx, tx, "ticket-uuid-1", models.TicketStatusVendido, models.TicketStatusUsadoEntrada)
	if !errors.Is(err, models.ErrStatusConflict) {
		t.Fatalf("expected ErrStatusConflict, got %v", err)
	}
}

func TestTicketRepository_RecordValidationTx(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := repo.BeginTx(ctx)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	val := &models.TicketValidation{
		TicketID:       "t1",
		ValidationType: models.ValidationTypeEntrada,
		ValidatedBy:    "op1",
		PreviousStatus: models.TicketStatusVendido,
		NewStatus:      models.TicketStatusUsadoEntrada,
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "validated_at"}).AddRow("val-uuid-1", now)
	mock.ExpectQuery(`INSERT INTO ticket_validations`).
		WithArgs(val.TicketID, val.ValidationType, val.ValidatedBy, val.PreviousStatus, val.NewStatus, val.Notes).
		WillReturnRows(rows)

	err = repo.RecordValidationTx(ctx, tx, val)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if val.ID != "val-uuid-1" {
		t.Errorf("expected val-uuid-1, got %s", val.ID)
	}
}

func TestTicketRepository_ListTickets(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"id", "ticket_number", "public_token", "four_digit_code", "ticket_type",
		"sale_source", "quota_source", "price_paid", "status", "buyer_id", "seller_id",
		"created_at", "updated_at",
		"first_name", "last_name", "phone", "email",
		"seller_name", "seller_email",
		"entry_validated_at", "entry_validator_name",
		"food_validated_at", "food_validator_name",
	}).AddRow(
		"ticket-uuid-1", 101, "tok123", "9999", models.TicketTypeSimple,
		models.SaleSourceAnticipada, models.QuotaSourcePersonal, 3000.0, models.TicketStatusVendido, "b1", "s1",
		now, now,
		"Carlos", "Buyer", "+54911000", "buyer@example.com",
		"Vendedor Admin", "seller@example.com",
		nil, nil,
		nil, nil,
	)

	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t.*WHERE t\.seller_id = \$1`).
		WithArgs("s1").
		WillReturnRows(rows)

	tickets, err := repo.ListTickets(ctx, "s1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(tickets) != 1 {
		t.Errorf("expected 1 ticket, got %d", len(tickets))
	}
}

func TestTicketRepository_TxVariants(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTicketRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := repo.BeginTx(ctx)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	now := time.Now()
	rows := func() *sqlmock.Rows {
		return sqlmock.NewRows([]string{
			"id", "ticket_number", "public_token", "four_digit_code", "ticket_type",
			"sale_source", "quota_source", "price_paid", "status", "buyer_id", "seller_id",
			"created_at", "updated_at",
			"first_name", "last_name", "phone", "email",
			"seller_name", "seller_email",
			"entry_validated_at", "entry_validator_name",
			"food_validated_at", "food_validator_name",
		}).AddRow(
			"t1", 101, "tok1", "1234", models.TicketTypeSimple,
			models.SaleSourceAnticipada, models.QuotaSourcePersonal, 3000.0, models.TicketStatusVendido, "b1", "s1",
			now, now,
			"Ana", "Rios", "+5491100", "ana@example.com",
			"Seller One", "seller@example.com",
			nil, nil,
			nil, nil,
		)
	}

	// 1. GetByIDTx
	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t.*WHERE t\.id = \$1 FOR UPDATE OF t`).
		WithArgs("t1").
		WillReturnRows(rows())

	t1, err := repo.GetByIDTx(ctx, tx, "t1")
	if err != nil || t1.ID != "t1" {
		t.Fatalf("GetByIDTx failed: %v", err)
	}

	// 2. GetByPublicTokenTx
	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t.*WHERE t\.public_token = \$1 FOR UPDATE OF t`).
		WithArgs("tok1").
		WillReturnRows(rows())

	t2, err := repo.GetByPublicTokenTx(ctx, tx, "tok1")
	if err != nil || t2.PublicToken != "tok1" {
		t.Fatalf("GetByPublicTokenTx failed: %v", err)
	}

	// 3. GetBy4DigitCodeTx
	mock.ExpectQuery(`SELECT t\.id.*FROM tickets t.*WHERE t\.four_digit_code = \$1.*FOR UPDATE OF t`).
		WithArgs("1234").
		WillReturnRows(rows())

	t3, err := repo.GetBy4DigitCodeTx(ctx, tx, "1234")
	if err != nil || t3.FourDigitCode != "1234" {
		t.Fatalf("GetBy4DigitCodeTx failed: %v", err)
	}

	// 4. UpdateStatusTx
	mock.ExpectExec(`UPDATE tickets SET status = \$1, updated_at = NOW\(\) WHERE id = \$2`).
		WithArgs(models.TicketStatusAnulado, "t1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.UpdateStatusTx(ctx, tx, "t1", models.TicketStatusAnulado)
	if err != nil {
		t.Fatalf("UpdateStatusTx failed: %v", err)
	}
}
