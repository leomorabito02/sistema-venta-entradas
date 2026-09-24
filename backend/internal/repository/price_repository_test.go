package repository

import (
	"context"
	"database/sql"
	"testing"

	"backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestPriceRepository_GetActivePrice(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewPriceRepository(db)
	ctx := context.Background()

	t.Run("DB Row Exists", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"price"}).AddRow(4500.0)
		mock.ExpectQuery(`SELECT price FROM ticket_prices`).
			WithArgs(models.TicketTypeSimple).
			WillReturnRows(rows)

		price, err := repo.GetActivePrice(ctx, models.TicketTypeSimple)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if price != 4500.0 {
			t.Errorf("expected 4500.0, got %f", price)
		}
	})

	t.Run("Fallback Default Simple", func(t *testing.T) {
		mock.ExpectQuery(`SELECT price FROM ticket_prices`).
			WithArgs(models.TicketTypeSimple).
			WillReturnError(sql.ErrNoRows)

		price, err := repo.GetActivePrice(ctx, models.TicketTypeSimple)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if price != 3000.0 {
			t.Errorf("expected default 3000.0, got %f", price)
		}
	})

	t.Run("Fallback Default ConComida", func(t *testing.T) {
		mock.ExpectQuery(`SELECT price FROM ticket_prices`).
			WithArgs(models.TicketTypeConComida).
			WillReturnError(sql.ErrNoRows)

		price, err := repo.GetActivePrice(ctx, models.TicketTypeConComida)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if price != 5000.0 {
			t.Errorf("expected default 5000.0, got %f", price)
		}
	})
}

func TestPriceRepository_SetActivePrice(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewPriceRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	mock.ExpectExec(`DELETE FROM ticket_prices WHERE ticket_type = \$1`).
		WithArgs(models.TicketTypeSimple).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectExec(`INSERT INTO ticket_prices`).
		WithArgs(models.TicketTypeSimple, 3500.0).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectCommit()

	err = repo.SetActivePrice(ctx, models.TicketTypeSimple, 3500.0)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestPriceRepository_GetAllActivePrices(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewPriceRepository(db)
	ctx := context.Background()

	rows := sqlmock.NewRows([]string{"ticket_type", "price"}).
		AddRow(models.TicketTypeSimple, 3200.0).
		AddRow(models.TicketTypeConComida, 5500.0)

	mock.ExpectQuery(`SELECT ticket_type, price FROM ticket_prices WHERE is_active = TRUE`).
		WillReturnRows(rows)

	prices, err := repo.GetAllActivePrices(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if prices[models.TicketTypeSimple] != 3200.0 || prices[models.TicketTypeConComida] != 5500.0 {
		t.Errorf("unexpected prices: %v", prices)
	}

	t.Run("Query Error Fallback", func(t *testing.T) {
		mock.ExpectQuery(`SELECT ticket_type, price FROM ticket_prices WHERE is_active = TRUE`).
			WillReturnError(sql.ErrConnDone)

		fallbackPrices, err := repo.GetAllActivePrices(ctx)
		if err != nil {
			t.Fatalf("expected no error on fallback, got %v", err)
		}
		if fallbackPrices[models.TicketTypeSimple] != 3000.0 {
			t.Errorf("expected fallback price 3000.0, got %f", fallbackPrices[models.TicketTypeSimple])
		}
	})
}
