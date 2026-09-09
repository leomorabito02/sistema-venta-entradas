package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"backend/internal/models"
)

type QuotaRepository interface {
	GetSellerQuota(ctx context.Context, sellerID string) (*models.SellerQuota, error)
	GetGlobalFreeQuota(ctx context.Context) (*models.GlobalFreeQuota, error)
	DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string) (models.QuotaSource, error)
	RestoreQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, quotaSource models.QuotaSource) error
	SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error
	SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error
	SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error
}

type postgresQuotaRepository struct {
	db *sql.DB
}

func NewQuotaRepository(db *sql.DB) QuotaRepository {
	return &postgresQuotaRepository{db: db}
}

func (r *postgresQuotaRepository) GetSellerQuota(ctx context.Context, sellerID string) (*models.SellerQuota, error) {
	query := `
		SELECT seller_id, assigned_quota, used_quota, used_free_quota, updated_at
		FROM seller_quotas WHERE seller_id = $1
	`
	q := &models.SellerQuota{}
	err := r.db.QueryRowContext(ctx, query, sellerID).
		Scan(&q.SellerID, &q.AssignedQuota, &q.UsedQuota, &q.UsedFreeQuota, &q.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		var defaultQuota int
		_ = r.db.QueryRowContext(ctx, `SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).Scan(&defaultQuota)
		return &models.SellerQuota{SellerID: sellerID, AssignedQuota: defaultQuota, UsedQuota: 0, UsedFreeQuota: 0}, nil
	}
	return q, err
}

func (r *postgresQuotaRepository) GetGlobalFreeQuota(ctx context.Context) (*models.GlobalFreeQuota, error) {
	query := `
		SELECT id, total_free_quota, used_free_quota, updated_at
		FROM global_free_quotas WHERE id = 1
	`
	q := &models.GlobalFreeQuota{}
	err := r.db.QueryRowContext(ctx, query).
		Scan(&q.ID, &q.TotalFreeQuota, &q.UsedFreeQuota, &q.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return &models.GlobalFreeQuota{ID: 1, TotalFreeQuota: 0, UsedFreeQuota: 0}, nil
	}
	return q, err
}

// DeductPresaleQuotaTx atomically checks and deducts presale quota inside an open transaction with FOR UPDATE locks (RNF-04.05, RNF-04.06, RNF-15.03).
func (r *postgresQuotaRepository) DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string) (models.QuotaSource, error) {
	// 1. Lock and fetch seller's quota row
	var assignedQuota, usedQuota int
	err := tx.QueryRowContext(ctx, `
		SELECT assigned_quota, used_quota
		FROM seller_quotas WHERE seller_id = $1 FOR UPDATE
	`, sellerID).Scan(&assignedQuota, &usedQuota)

	if errors.Is(err, sql.ErrNoRows) {
		// Fetch configured default personal quota
		var defaultQuota int
		_ = tx.QueryRowContext(ctx, `SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).Scan(&defaultQuota)

		// Ensure a seller_quotas row exists with default assigned quota
		_, err = tx.ExecContext(ctx, `INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, used_free_quota) VALUES ($1, $2, 0, 0)`, sellerID, defaultQuota)
		if err != nil {
			return "", fmt.Errorf("failed to init seller quota: %w", err)
		}
		assignedQuota, usedQuota = defaultQuota, 0
	} else if err != nil {
		return "", fmt.Errorf("failed to lock seller quota: %w", err)
	}

	// Check personal quota availability
	if usedQuota < assignedQuota {
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_quota = used_quota + 1, updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		if err != nil {
			return "", fmt.Errorf("failed to deduct personal quota: %w", err)
		}
		return models.QuotaSourcePersonal, nil
	}

	// 2. Personal quota exhausted; lock and check global free quota pool
	var totalFree, usedFree int
	err = tx.QueryRowContext(ctx, `
		SELECT total_free_quota, used_free_quota
		FROM global_free_quotas WHERE id = 1 FOR UPDATE
	`).Scan(&totalFree, &usedFree)

	if errors.Is(err, sql.ErrNoRows) {
		_, err = tx.ExecContext(ctx, `INSERT INTO global_free_quotas (id, total_free_quota, used_free_quota) VALUES (1, 0, 0)`)
		if err != nil {
			return "", fmt.Errorf("failed to init global free quota: %w", err)
		}
		totalFree, usedFree = 0, 0
	} else if err != nil {
		return "", fmt.Errorf("failed to lock global free quota: %w", err)
	}

	if usedFree < totalFree {
		// Increment global used free quota
		_, err = tx.ExecContext(ctx, `
			UPDATE global_free_quotas SET used_free_quota = used_free_quota + 1, updated_at = NOW() WHERE id = 1
		`)
		if err != nil {
			return "", fmt.Errorf("failed to deduct global free quota: %w", err)
		}
		// Increment seller's used_free_quota counter
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_free_quota = used_free_quota + 1, updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		if err != nil {
			return "", fmt.Errorf("failed to update seller free quota count: %w", err)
		}
		return models.QuotaSourceLibre, nil
	}

	return "", fmt.Errorf("quota exhausted: no personal or free presale tickets available")
}

// RestoreQuotaTx restores a presale quota unit upon ticket annulment (RNF-14.07, RF-27.08).
func (r *postgresQuotaRepository) RestoreQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, quotaSource models.QuotaSource) error {
	switch quotaSource {
	case models.QuotaSourcePersonal:
		_, err := tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_quota = GREATEST(0, used_quota - 1), updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		return err
	case models.QuotaSourceLibre:
		_, err := tx.ExecContext(ctx, `
			UPDATE global_free_quotas SET used_free_quota = GREATEST(0, used_free_quota - 1), updated_at = NOW() WHERE id = 1
		`)
		if err != nil {
			return err
		}
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_free_quota = GREATEST(0, used_free_quota - 1), updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		return err
	}
	return nil
}

func (r *postgresQuotaRepository) SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var previousAssigned int
	err = tx.QueryRowContext(ctx, `SELECT assigned_quota FROM seller_quotas WHERE seller_id = $1 FOR UPDATE`, sellerID).
		Scan(&previousAssigned)
	if errors.Is(err, sql.ErrNoRows) {
		previousAssigned = 0
		_, err = tx.ExecContext(ctx, `
			INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, used_free_quota)
			VALUES ($1, $2, 0, 0)
		`, sellerID, assigned)
	} else {
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET assigned_quota = $1, updated_at = NOW() WHERE seller_id = $2
		`, assigned, sellerID)
	}
	if err != nil {
		return err
	}

	// Insert audit log (RNF-11.08)
	_, err = tx.ExecContext(ctx, `
		INSERT INTO quota_audit_logs (id, admin_id, seller_id, quota_type, previous_assigned, new_assigned, created_at)
		VALUES (gen_random_uuid(), $1, $2, 'PERSONAL', $3, $4, NOW())
	`, adminID, sellerID, previousAssigned, assigned)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *postgresQuotaRepository) SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Update or insert default personal quota config (for future new sellers)
	_, err = tx.ExecContext(ctx, `
		INSERT INTO default_quota_configs (id, default_personal_quota, updated_at)
		VALUES (1, $1, NOW())
		ON CONFLICT (id) DO UPDATE SET default_personal_quota = EXCLUDED.default_personal_quota, updated_at = NOW()
	`, assigned)
	if err != nil {
		return fmt.Errorf("failed to update default personal quota config: %w", err)
	}

	// 2. Ensure all existing sellers in users table have a row in seller_quotas updated to assigned
	_, err = tx.ExecContext(ctx, `
		INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, used_free_quota, updated_at)
		SELECT id, $1, 0, 0, NOW() FROM users WHERE role = 'SELLER'
		ON CONFLICT (seller_id) DO UPDATE SET assigned_quota = EXCLUDED.assigned_quota, updated_at = NOW()
	`, assigned)
	if err != nil {
		return fmt.Errorf("failed to update seller quotas for all sellers: %w", err)
	}

	// 3. Insert audit log
	_, err = tx.ExecContext(ctx, `
		INSERT INTO quota_audit_logs (id, admin_id, seller_id, quota_type, previous_assigned, new_assigned, created_at)
		VALUES (gen_random_uuid(), $1, NULL, 'PERSONAL', 0, $2, NOW())
	`, adminID, assigned)
	if err != nil {
		return fmt.Errorf("failed to insert audit log: %w", err)
	}

	return tx.Commit()
}

func (r *postgresQuotaRepository) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var previousAssigned int
	err = tx.QueryRowContext(ctx, `SELECT total_free_quota FROM global_free_quotas WHERE id = 1 FOR UPDATE`).
		Scan(&previousAssigned)
	if errors.Is(err, sql.ErrNoRows) {
		previousAssigned = 0
		_, err = tx.ExecContext(ctx, `
			INSERT INTO global_free_quotas (id, total_free_quota, used_free_quota) VALUES (1, $1, 0)
		`, totalFree)
	} else {
		_, err = tx.ExecContext(ctx, `
			UPDATE global_free_quotas SET total_free_quota = $1, updated_at = NOW() WHERE id = 1
		`, totalFree)
	}
	if err != nil {
		return err
	}

	// Insert audit log (RNF-11.08)
	_, err = tx.ExecContext(ctx, `
		INSERT INTO quota_audit_logs (id, admin_id, seller_id, quota_type, previous_assigned, new_assigned, created_at)
		VALUES (gen_random_uuid(), $1, NULL, 'FREE', $2, $3, NOW())
	`, adminID, previousAssigned, totalFree)
	if err != nil {
		return err
	}

	return tx.Commit()
}
