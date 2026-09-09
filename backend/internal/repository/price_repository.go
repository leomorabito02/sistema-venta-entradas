package repository

import (
	"context"
	"database/sql"
	"errors"

	"backend/internal/models"
)

type PriceRepository interface {
	GetActivePrice(ctx context.Context, ticketType models.TicketType) (float64, error)
	SetActivePrice(ctx context.Context, ticketType models.TicketType, price float64) error
	GetAllActivePrices(ctx context.Context) (map[models.TicketType]float64, error)
}

type postgresPriceRepository struct {
	db *sql.DB
}

func NewPriceRepository(db *sql.DB) PriceRepository {
	return &postgresPriceRepository{db: db}
}

func (r *postgresPriceRepository) GetActivePrice(ctx context.Context, ticketType models.TicketType) (float64, error) {
	query := `
		SELECT price FROM ticket_prices
		WHERE ticket_type = $1 AND is_active = TRUE
		ORDER BY created_at DESC LIMIT 1
	`
	var price float64
	err := r.db.QueryRowContext(ctx, query, ticketType).Scan(&price)
	if errors.Is(err, sql.ErrNoRows) {
		// Fallback default prices if not yet configured in DB
		if ticketType == models.TicketTypeConComida {
			return 5000.0, nil
		}
		return 3000.0, nil
	}
	return price, err
}

func (r *postgresPriceRepository) SetActivePrice(ctx context.Context, ticketType models.TicketType, price float64) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Delete existing records for this ticket_type to prevent duplicate rows in ticket_prices
	_, err = tx.ExecContext(ctx, `DELETE FROM ticket_prices WHERE ticket_type = $1`, ticketType)
	if err != nil {
		return err
	}

	// Insert single active price record for this ticket_type
	_, err = tx.ExecContext(ctx, `
		INSERT INTO ticket_prices (id, ticket_type, price, is_active, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, TRUE, NOW(), NOW())
	`, ticketType, price)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *postgresPriceRepository) GetAllActivePrices(ctx context.Context) (map[models.TicketType]float64, error) {
	prices := map[models.TicketType]float64{
		models.TicketTypeSimple:    3000.0,
		models.TicketTypeConComida: 5000.0,
	}

	query := `
		SELECT ticket_type, price
		FROM ticket_prices
		WHERE is_active = TRUE
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return prices, nil
	}
	defer rows.Close()

	for rows.Next() {
		var tType models.TicketType
		var price float64
		if err := rows.Scan(&tType, &price); err == nil {
			prices[tType] = price
		}
	}

	if err := rows.Err(); err != nil {
		return prices, err
	}

	return prices, nil
}
