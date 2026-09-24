package repository

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestTokenRepository_CreateRefreshToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTokenRepository(db)
	ctx := context.Background()

	token := &models.RefreshToken{
		UserID:    "user-uuid-1",
		TokenHash: "hash123",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "created_at"}).AddRow("token-uuid-1", now)

	mock.ExpectQuery(`INSERT INTO refresh_tokens`).
		WithArgs(token.UserID, token.TokenHash, token.ExpiresAt).
		WillReturnRows(rows)

	err = repo.CreateRefreshToken(ctx, token)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if token.ID != "token-uuid-1" {
		t.Errorf("expected token-uuid-1, got %s", token.ID)
	}
}

func TestTokenRepository_GetByHash(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTokenRepository(db)
	ctx := context.Background()

	now := time.Now()
	exp := now.Add(24 * time.Hour)
	rows := sqlmock.NewRows([]string{"id", "user_id", "token_hash", "expires_at", "created_at", "revoked_at"}).
		AddRow("token-uuid-1", "user-uuid-1", "hash123", exp, now, nil)

	mock.ExpectQuery(`SELECT id, user_id, token_hash, expires_at, created_at, revoked_at FROM refresh_tokens`).
		WithArgs("hash123").
		WillReturnRows(rows)

	tkn, err := repo.GetByHash(ctx, "hash123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tkn.UserID != "user-uuid-1" {
		t.Errorf("expected user-uuid-1, got %s", tkn.UserID)
	}

	t.Run("Not Found", func(t *testing.T) {
		mock.ExpectQuery(`SELECT id, user_id, token_hash, expires_at, created_at, revoked_at FROM refresh_tokens`).
			WithArgs("nonexistent-hash").
			WillReturnError(sql.ErrNoRows)

		_, err := repo.GetByHash(ctx, "nonexistent-hash")
		if err == nil {
			t.Errorf("expected error for non-existent token hash")
		}
	})
}

func TestTokenRepository_RevokeToken(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTokenRepository(db)
	ctx := context.Background()

	mock.ExpectExec(`DELETE FROM refresh_tokens WHERE token_hash = \$1`).
		WithArgs("hash123").
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.RevokeToken(ctx, "hash123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestTokenRepository_RevokeAllUserTokens(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewTokenRepository(db)
	ctx := context.Background()

	mock.ExpectExec(`UPDATE refresh_tokens SET revoked_at = NOW\(\) WHERE user_id = \$1 AND revoked_at IS NULL`).
		WithArgs("user-uuid-1").
		WillReturnResult(sqlmock.NewResult(0, 2))

	err = repo.RevokeAllUserTokens(ctx, "user-uuid-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}
