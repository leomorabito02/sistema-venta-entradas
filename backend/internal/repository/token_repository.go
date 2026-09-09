package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"backend/internal/models"
)

type TokenRepository interface {
	CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error
	GetByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error)
	RevokeToken(ctx context.Context, tokenHash string) error
	RevokeAllUserTokens(ctx context.Context, userID string) error
}

type postgresTokenRepository struct {
	db *sql.DB
}

func NewTokenRepository(db *sql.DB) TokenRepository {
	return &postgresTokenRepository{db: db}
}

func (r *postgresTokenRepository) CreateRefreshToken(ctx context.Context, t *models.RefreshToken) error {
	query := `
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
		VALUES (gen_random_uuid(), $1, $2, $3, NOW())
		RETURNING id, created_at
	`
	return r.db.QueryRowContext(ctx, query, t.UserID, t.TokenHash, t.ExpiresAt).
		Scan(&t.ID, &t.CreatedAt)
}

func (r *postgresTokenRepository) GetByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error) {
	query := `
		SELECT id, user_id, token_hash, expires_at, created_at, revoked_at
		FROM refresh_tokens WHERE token_hash = $1
	`
	t := &models.RefreshToken{}
	err := r.db.QueryRowContext(ctx, query, tokenHash).
		Scan(&t.ID, &t.UserID, &t.TokenHash, &t.ExpiresAt, &t.CreatedAt, &t.RevokedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("refresh token not found")
	}
	return t, err
}

func (r *postgresTokenRepository) RevokeToken(ctx context.Context, tokenHash string) error {
	query := `DELETE FROM refresh_tokens WHERE token_hash = $1`
	_, err := r.db.ExecContext(ctx, query, tokenHash)
	return err
}

func (r *postgresTokenRepository) RevokeAllUserTokens(ctx context.Context, userID string) error {
	query := `UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`
	_, err := r.db.ExecContext(ctx, query, userID)
	return err
}
