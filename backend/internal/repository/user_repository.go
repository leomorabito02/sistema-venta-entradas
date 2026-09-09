package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"backend/internal/models"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetByGoogleID(ctx context.Context, googleID string) (*models.User, error)
	UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error)
	Update(ctx context.Context, user *models.User) error
	List(ctx context.Context) ([]*models.User, error)
	SeedInitialAdmin(ctx context.Context, email, name string) error
}

type postgresUserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &postgresUserRepository{db: db}
}

func (r *postgresUserRepository) Create(ctx context.Context, u *models.User) error {
	query := `
		INSERT INTO users (id, email, name, google_id, role, status, password_hash, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query, u.Email, u.Name, u.GoogleID, u.Role, u.Status, u.PasswordHash).
		Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
}

func (r *postgresUserRepository) GetByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at
		FROM users WHERE id = $1
	`
	u := &models.User{}
	err := r.db.QueryRowContext(ctx, query, id).
		Scan(&u.ID, &u.Email, &u.Name, &u.GoogleID, &u.Role, &u.Status, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("user not found")
	}
	return u, err
}

func (r *postgresUserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at
		FROM users WHERE email = $1
	`
	u := &models.User{}
	err := r.db.QueryRowContext(ctx, query, email).
		Scan(&u.ID, &u.Email, &u.Name, &u.GoogleID, &u.Role, &u.Status, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("user not found")
	}
	return u, err
}

func (r *postgresUserRepository) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	query := `
		SELECT id, email, name, google_id, role, status, password_hash, created_at, updated_at
		FROM users WHERE google_id = $1
	`
	u := &models.User{}
	err := r.db.QueryRowContext(ctx, query, googleID).
		Scan(&u.ID, &u.Email, &u.Name, &u.GoogleID, &u.Role, &u.Status, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("user not found")
	}
	return u, err
}

// UpsertGoogleUser retrieves existing user or auto-creates a new user in PENDING state (RF-01.07).
func (r *postgresUserRepository) UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error) {
	// Try finding user by googleID or email
	u, err := r.GetByGoogleID(ctx, googleID)
	if err == nil {
		return u, false, nil
	}

	u, err = r.GetByEmail(ctx, email)
	if err == nil {
		// Link google_id if missing
		if u.GoogleID == nil || *u.GoogleID == "" {
			u.GoogleID = &googleID
			_, _ = r.db.ExecContext(ctx, `UPDATE users SET google_id = $1, updated_at = NOW() WHERE id = $2`, googleID, u.ID)
		}
		return u, false, nil
	}

	// New user registration defaults to SELLER role and PENDING status (RF-01.07)
	newUser := &models.User{
		Email:    email,
		Name:     name,
		GoogleID: &googleID,
		Role:     models.RoleSeller,
		Status:   models.StatusPending,
	}

	if err := r.Create(ctx, newUser); err != nil {
		return nil, false, fmt.Errorf("failed to create pending user: %w", err)
	}

	return newUser, true, nil
}

func (r *postgresUserRepository) Update(ctx context.Context, u *models.User) error {
	query := `
		UPDATE users
		SET email = $1, name = $2, role = $3, status = $4, updated_at = NOW()
		WHERE id = $5
	`
	_, err := r.db.ExecContext(ctx, query, u.Email, u.Name, u.Role, u.Status, u.ID)
	return err
}

func (r *postgresUserRepository) List(ctx context.Context) ([]*models.User, error) {
	query := `
		SELECT id, email, name, google_id, role, status, created_at, updated_at
		FROM users ORDER BY name ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		u := &models.User{}
		if err := rows.Scan(&u.ID, &u.Email, &u.Name, &u.GoogleID, &u.Role, &u.Status, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

func (r *postgresUserRepository) SeedInitialAdmin(ctx context.Context, email, name string) error {
	query := `
		INSERT INTO users (id, email, name, role, status, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, 'ADMIN', 'ACTIVE', NOW(), NOW())
		ON CONFLICT (email) DO NOTHING
	`
	_, err := r.db.ExecContext(ctx, query, email, name)
	return err
}

