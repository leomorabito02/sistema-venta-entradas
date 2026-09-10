package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"backend/internal/models"
)

type TicketRepository interface {
	BeginTx(ctx context.Context) (*sql.Tx, error)
	CreateBuyer(ctx context.Context, buyer *models.Buyer) error
	CreateBuyerTx(ctx context.Context, tx *sql.Tx, buyer *models.Buyer) error
	CreateTicketTx(ctx context.Context, tx *sql.Tx, ticket *models.Ticket) error
	GetByID(ctx context.Context, id string) (*models.Ticket, error)
	GetByIDTx(ctx context.Context, tx *sql.Tx, id string) (*models.Ticket, error)
	GetByPublicToken(ctx context.Context, token string) (*models.Ticket, error)
	GetByPublicTokenTx(ctx context.Context, tx *sql.Tx, token string) (*models.Ticket, error)
	GetBy4DigitCode(ctx context.Context, code string) (*models.Ticket, error)
	GetBy4DigitCodeTx(ctx context.Context, tx *sql.Tx, code string) (*models.Ticket, error)
	Is4DigitCodeExists(ctx context.Context, code string) (bool, error)
	UpdateStatusTx(ctx context.Context, tx *sql.Tx, ticketID string, status models.TicketStatus) error
	RecordValidationTx(ctx context.Context, tx *sql.Tx, val *models.TicketValidation) error
	ListTickets(ctx context.Context, sellerID string) ([]*models.Ticket, error)
}

type postgresTicketRepository struct {
	db *sql.DB
}

func NewTicketRepository(db *sql.DB) TicketRepository {
	return &postgresTicketRepository{db: db}
}

func (r *postgresTicketRepository) BeginTx(ctx context.Context) (*sql.Tx, error) {
	return r.db.BeginTx(ctx, nil)
}

func (r *postgresTicketRepository) CreateBuyer(ctx context.Context, b *models.Buyer) error {
	query := `
		INSERT INTO buyers (id, first_name, last_name, phone, email, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
		RETURNING id, created_at
	`
	return r.db.QueryRowContext(ctx, query, b.FirstName, b.LastName, b.Phone, b.Email).
		Scan(&b.ID, &b.CreatedAt)
}

func (r *postgresTicketRepository) CreateBuyerTx(ctx context.Context, tx *sql.Tx, b *models.Buyer) error {
	query := `
		INSERT INTO buyers (id, first_name, last_name, phone, email, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
		RETURNING id, created_at
	`
	return tx.QueryRowContext(ctx, query, b.FirstName, b.LastName, b.Phone, b.Email).
		Scan(&b.ID, &b.CreatedAt)
}

func (r *postgresTicketRepository) CreateTicketTx(ctx context.Context, tx *sql.Tx, t *models.Ticket) error {
	query := `
		INSERT INTO tickets (
			id, public_token, four_digit_code, ticket_type, sale_source, quota_source,
			price_paid, status, buyer_id, seller_id, created_at, updated_at
		) VALUES (
			gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
		) RETURNING id, ticket_number, created_at, updated_at
	`
	return tx.QueryRowContext(
		ctx, query,
		t.PublicToken, t.FourDigitCode, t.TicketType, t.SaleSource, t.QuotaSource,
		t.PricePaid, t.Status, t.BuyerID, t.SellerID,
	).Scan(&t.ID, &t.TicketNumber, &t.CreatedAt, &t.UpdatedAt)
}

const ticketBaseQuery = `
	SELECT t.id, t.ticket_number, t.public_token, t.four_digit_code, t.ticket_type,
	       t.sale_source, t.quota_source, t.price_paid, t.status, t.buyer_id, t.seller_id,
	       t.created_at, t.updated_at,
	       b.first_name, b.last_name, b.phone, b.email,
	       u.name AS seller_name, u.email AS seller_email,
	       tv_e.validated_at AS entry_validated_at,
	       uv_e.name AS entry_validator_name,
	       tv_f.validated_at AS food_validated_at,
	       uv_f.name AS food_validator_name
	FROM tickets t
	JOIN buyers b ON t.buyer_id = b.id
	JOIN users u ON t.seller_id = u.id
	LEFT JOIN LATERAL (
		SELECT validated_at, validated_by
		FROM ticket_validations
		WHERE ticket_id = t.id AND validation_type = 'ENTRADA'
		ORDER BY validated_at DESC LIMIT 1
	) tv_e ON true
	LEFT JOIN users uv_e ON tv_e.validated_by = uv_e.id
	LEFT JOIN LATERAL (
		SELECT validated_at, validated_by
		FROM ticket_validations
		WHERE ticket_id = t.id AND validation_type = 'COMIDA'
		ORDER BY validated_at DESC LIMIT 1
	) tv_f ON true
	LEFT JOIN users uv_f ON tv_f.validated_by = uv_f.id
`

func (r *postgresTicketRepository) GetByID(ctx context.Context, id string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.id = $1`
	return r.scanTicketRow(r.db.QueryRowContext(ctx, query, id))
}

func (r *postgresTicketRepository) GetByIDTx(ctx context.Context, tx *sql.Tx, id string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.id = $1 FOR UPDATE OF t`
	return r.scanTicketRow(tx.QueryRowContext(ctx, query, id))
}

func (r *postgresTicketRepository) GetByPublicToken(ctx context.Context, token string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.public_token = $1`
	return r.scanTicketRow(r.db.QueryRowContext(ctx, query, token))
}

func (r *postgresTicketRepository) GetByPublicTokenTx(ctx context.Context, tx *sql.Tx, token string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.public_token = $1 FOR UPDATE OF t`
	return r.scanTicketRow(tx.QueryRowContext(ctx, query, token))
}

func (r *postgresTicketRepository) GetBy4DigitCode(ctx context.Context, code string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.four_digit_code = $1 ORDER BY t.created_at DESC LIMIT 1`
	return r.scanTicketRow(r.db.QueryRowContext(ctx, query, code))
}

func (r *postgresTicketRepository) GetBy4DigitCodeTx(ctx context.Context, tx *sql.Tx, code string) (*models.Ticket, error) {
	query := ticketBaseQuery + ` WHERE t.four_digit_code = $1 ORDER BY t.created_at DESC LIMIT 1 FOR UPDATE OF t`
	return r.scanTicketRow(tx.QueryRowContext(ctx, query, code))
}

func (r *postgresTicketRepository) Is4DigitCodeExists(ctx context.Context, code string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM tickets WHERE four_digit_code = $1)`
	var exists bool
	err := r.db.QueryRowContext(ctx, query, code).Scan(&exists)
	return exists, err
}

func (r *postgresTicketRepository) UpdateStatusTx(ctx context.Context, tx *sql.Tx, ticketID string, status models.TicketStatus) error {
	query := `UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := tx.ExecContext(ctx, query, status, ticketID)
	return err
}

func (r *postgresTicketRepository) RecordValidationTx(ctx context.Context, tx *sql.Tx, v *models.TicketValidation) error {
	query := `
		INSERT INTO ticket_validations (id, ticket_id, validation_type, validated_by, previous_status, new_status, notes, validated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
		RETURNING id, validated_at
	`
	return tx.QueryRowContext(ctx, query, v.TicketID, v.ValidationType, v.ValidatedBy, v.PreviousStatus, v.NewStatus, v.Notes).
		Scan(&v.ID, &v.ValidatedAt)
}

func (r *postgresTicketRepository) scanTicketRow(row *sql.Row) (*models.Ticket, error) {
	t := &models.Ticket{Buyer: &models.Buyer{}, Seller: &models.User{}}
	var entryValAt sql.NullTime
	var entryValName sql.NullString
	var foodValAt sql.NullTime
	var foodValName sql.NullString

	err := row.Scan(
		&t.ID, &t.TicketNumber, &t.PublicToken, &t.FourDigitCode, &t.TicketType,
		&t.SaleSource, &t.QuotaSource, &t.PricePaid, &t.Status, &t.BuyerID, &t.SellerID,
		&t.CreatedAt, &t.UpdatedAt,
		&t.Buyer.FirstName, &t.Buyer.LastName, &t.Buyer.Phone, &t.Buyer.Email,
		&t.Seller.Name, &t.Seller.Email,
		&entryValAt, &entryValName,
		&foodValAt, &foodValName,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("ticket not found")
	}
	if err != nil {
		return nil, err
	}
	t.Buyer.ID = t.BuyerID
	t.Seller.ID = t.SellerID
	if entryValAt.Valid {
		t.EntryValidatedAt = &entryValAt.Time
	}
	if entryValName.Valid {
		t.EntryValidatorName = &entryValName.String
	}
	if foodValAt.Valid {
		t.FoodValidatedAt = &foodValAt.Time
	}
	if foodValName.Valid {
		t.FoodValidatorName = &foodValName.String
	}
	return t, nil
}

func (r *postgresTicketRepository) ListTickets(ctx context.Context, sellerID string) ([]*models.Ticket, error) {
	var rows *sql.Rows
	var err error

	for attempts := 0; attempts < 2; attempts++ {
		if sellerID != "" {
			rows, err = r.db.QueryContext(ctx, ticketBaseQuery+" WHERE t.seller_id = $1 ORDER BY t.created_at DESC", sellerID)
		} else {
			rows, err = r.db.QueryContext(ctx, ticketBaseQuery+" ORDER BY t.created_at DESC")
		}

		if err != nil && (strings.Contains(err.Error(), "26000") || strings.Contains(err.Error(), "unnamed prepared statement")) && attempts == 0 {
			continue
		}
		break
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tickets []*models.Ticket
	for rows.Next() {
		t := &models.Ticket{Buyer: &models.Buyer{}, Seller: &models.User{}}
		var entryValAt sql.NullTime
		var entryValName sql.NullString
		var foodValAt sql.NullTime
		var foodValName sql.NullString

		err := rows.Scan(
			&t.ID, &t.TicketNumber, &t.PublicToken, &t.FourDigitCode, &t.TicketType,
			&t.SaleSource, &t.QuotaSource, &t.PricePaid, &t.Status, &t.BuyerID, &t.SellerID,
			&t.CreatedAt, &t.UpdatedAt,
			&t.Buyer.FirstName, &t.Buyer.LastName, &t.Buyer.Phone, &t.Buyer.Email,
			&t.Seller.Name, &t.Seller.Email,
			&entryValAt, &entryValName,
			&foodValAt, &foodValName,
		)
		if err != nil {
			return nil, err
		}
		t.Buyer.ID = t.BuyerID
		t.Seller.ID = t.SellerID
		if entryValAt.Valid {
			t.EntryValidatedAt = &entryValAt.Time
		}
		if entryValName.Valid {
			t.EntryValidatorName = &entryValName.String
		}
		if foodValAt.Valid {
			t.FoodValidatedAt = &foodValAt.Time
		}
		if foodValName.Valid {
			t.FoodValidatorName = &foodValName.String
		}
		tickets = append(tickets, t)
	}
	return tickets, rows.Err()
}
