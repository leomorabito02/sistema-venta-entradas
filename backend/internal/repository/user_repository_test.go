package repository

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestUserRepository_Create(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	u := &models.User{
		Email:  "newuser@example.com",
		Name:   "New User",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "created_at", "updated_at"}).AddRow("user-uuid-1", now, now)
	mock.ExpectQuery(`INSERT INTO users`).
		WithArgs(u.Email, u.Name, u.GoogleID, u.Role, u.Status, u.PasswordHash).
		WillReturnRows(rows)

	err = repo.Create(ctx, u)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if u.ID != "user-uuid-1" {
		t.Errorf("expected user-uuid-1, got %s", u.ID)
	}
}

func TestUserRepository_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "email", "name", "google_id", "role", "status", "password_hash", "created_at", "updated_at"}).
		AddRow("user-uuid-1", "admin@example.com", "Admin User", nil, models.RoleAdmin, models.StatusActive, nil, now, now)

	mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE id = \$1`).
		WithArgs("user-uuid-1").
		WillReturnRows(rows)

	u, err := repo.GetByID(ctx, "user-uuid-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if u.Email != "admin@example.com" || u.Role != models.RoleAdmin {
		t.Errorf("unexpected user values: %v", u)
	}
}

func TestUserRepository_GetByEmail(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "email", "name", "google_id", "role", "status", "password_hash", "created_at", "updated_at"}).
		AddRow("user-uuid-1", "admin@example.com", "Admin User", nil, models.RoleAdmin, models.StatusActive, nil, now, now)

	mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE email = \$1`).
		WithArgs("admin@example.com").
		WillReturnRows(rows)

	u, err := repo.GetByEmail(ctx, "admin@example.com")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if u.ID != "user-uuid-1" {
		t.Errorf("expected user-uuid-1, got %s", u.ID)
	}
}

func TestUserRepository_GetByGoogleID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	gID := "google-123"
	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "email", "name", "google_id", "role", "status", "password_hash", "created_at", "updated_at"}).
		AddRow("user-uuid-1", "admin@example.com", "Admin User", gID, models.RoleAdmin, models.StatusActive, nil, now, now)

	mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE google_id = \$1`).
		WithArgs(gID).
		WillReturnRows(rows)

	u, err := repo.GetByGoogleID(ctx, gID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if u.ID != "user-uuid-1" {
		t.Errorf("expected user-uuid-1, got %s", u.ID)
	}
}

func TestUserRepository_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	u := &models.User{
		ID:     "user-uuid-1",
		Email:  "updated@example.com",
		Name:   "Updated Name",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}

	mock.ExpectExec(`UPDATE users SET email = \$1, name = \$2, role = \$3, status = \$4, updated_at = NOW\(\) WHERE id = \$5`).
		WithArgs(u.Email, u.Name, u.Role, u.Status, u.ID).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.Update(ctx, u)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestUserRepository_List(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{"id", "email", "name", "google_id", "role", "status", "created_at", "updated_at"}).
		AddRow("u1", "u1@test.com", "User 1", nil, models.RoleSeller, models.StatusActive, now, now).
		AddRow("u2", "u2@test.com", "User 2", nil, models.RoleSeller, models.StatusActive, now, now)

	mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, created_at, updated_at FROM users ORDER BY name ASC`).
		WillReturnRows(rows)

	users, err := repo.List(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(users) != 2 {
		t.Errorf("expected 2 users, got %d", len(users))
	}
}

func TestUserRepository_SeedInitialAdmin(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()

	mock.ExpectExec(`INSERT INTO users`).
		WithArgs("admin@test.com", "Admin").
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.SeedInitialAdmin(ctx, "admin@test.com", "Admin")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestUserRepository_UpsertGoogleUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	ctx := context.Background()
	now := time.Now()

	t.Run("Existing Google User", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id", "email", "name", "google_id", "role", "status", "password_hash", "created_at", "updated_at"}).
			AddRow("u-g1", "guser@example.com", "Google User", "gid-100", models.RoleSeller, models.StatusActive, nil, now, now)

		mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE google_id = \$1`).
			WithArgs("gid-100").
			WillReturnRows(rows)

		u, isNew, err := repo.UpsertGoogleUser(ctx, "guser@example.com", "Google User", "gid-100")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if isNew || u.ID != "u-g1" {
			t.Errorf("expected existing user u-g1, got %v, isNew=%v", u, isNew)
		}
	})

	t.Run("New Google User Creation", func(t *testing.T) {
		mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE google_id = \$1`).
			WithArgs("gid-200").
			WillReturnError(sql.ErrNoRows)

		mock.ExpectQuery(`SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at FROM users WHERE email = \$1`).
			WithArgs("newg@example.com").
			WillReturnError(sql.ErrNoRows)

		insertRows := sqlmock.NewRows([]string{"id", "created_at", "updated_at"}).AddRow("u-newg", now, now)
		mock.ExpectQuery(`INSERT INTO users`).
			WithArgs("newg@example.com", "New Google User", "gid-200", models.RoleSeller, models.StatusPending, nil).
			WillReturnRows(insertRows)

		u, isNew, err := repo.UpsertGoogleUser(ctx, "newg@example.com", "New Google User", "gid-200")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if !isNew || u.ID != "u-newg" {
			t.Errorf("expected new user u-newg, got %v, isNew=%v", u, isNew)
		}
	})
}
