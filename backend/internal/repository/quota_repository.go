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
	DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, preferredSource models.QuotaSource) (models.QuotaSource, error)
	RestoreQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, quotaSource models.QuotaSource) error
	SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error
	SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error
	SetSellerFreeQuota(ctx context.Context, adminID string, sellerID string, assigned int) error
	SetAllSellersFreeQuota(ctx context.Context, adminID string, assigned int) error
	SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error
	GetDefaultQuotaConfig(ctx context.Context) (*models.DefaultQuotaConfig, error)
	GetAllSellersQuotas(ctx context.Context) ([]*models.SellerQuotaDetail, error)
	GetFreeQuotaUsageBySeller(ctx context.Context) ([]*models.SellerFreeQuotaUsage, error)
}

type postgresQuotaRepository struct {
	db *sql.DB
}

func NewQuotaRepository(db *sql.DB) QuotaRepository {
	return &postgresQuotaRepository{db: db}
}

func (r *postgresQuotaRepository) GetSellerQuota(ctx context.Context, sellerID string) (*models.SellerQuota, error) {
	query := `
		SELECT seller_id, assigned_quota, used_quota, assigned_free_quota, used_free_quota, COALESCE(updated_at, NOW())
		FROM seller_quotas WHERE seller_id = $1
	`
	q := &models.SellerQuota{}
	err := r.db.QueryRowContext(ctx, query, sellerID).
		Scan(&q.SellerID, &q.AssignedQuota, &q.UsedQuota, &q.AssignedFreeQuota, &q.UsedFreeQuota, &q.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		var defaultPersonal, defaultFree int
		_ = r.db.QueryRowContext(ctx, `SELECT default_personal_quota, COALESCE(default_free_quota, 5) FROM default_quota_configs WHERE id = 1`).Scan(&defaultPersonal, &defaultFree)
		if defaultFree <= 0 {
			defaultFree = 5
		}
		return &models.SellerQuota{SellerID: sellerID, AssignedQuota: defaultPersonal, UsedQuota: 0, AssignedFreeQuota: defaultFree, UsedFreeQuota: 0}, nil
	}
	return q, err
}

func (r *postgresQuotaRepository) GetGlobalFreeQuota(ctx context.Context) (*models.GlobalFreeQuota, error) {
	query := `
		SELECT COALESCE(SUM(assigned_free_quota), 0), COALESCE(SUM(used_free_quota), 0)
		FROM seller_quotas
	`
	q := &models.GlobalFreeQuota{ID: 1}
	err := r.db.QueryRowContext(ctx, query).Scan(&q.TotalFreeQuota, &q.UsedFreeQuota)
	if err != nil {
		return &models.GlobalFreeQuota{ID: 1, TotalFreeQuota: 0, UsedFreeQuota: 0}, nil
	}
	return q, nil
}

// DeductPresaleQuotaTx atomically checks and deducts presale quota inside an open transaction with FOR UPDATE locks (RNF-04.05, RNF-04.06, RNF-15.03).
func (r *postgresQuotaRepository) DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, preferredSource models.QuotaSource) (models.QuotaSource, error) {
	if preferredSource == models.QuotaSourceLibre {
		return r.deductGlobalFreeQuotaTx(ctx, tx, sellerID)
	}

	if preferredSource == models.QuotaSourcePersonal {
		return r.deductPersonalQuotaTx(ctx, tx, sellerID)
	}

	// Automatic fallback: try personal quota first, then global free quota
	qs, err := r.deductPersonalQuotaTx(ctx, tx, sellerID)
	if err == nil {
		return qs, nil
	}
	return r.deductGlobalFreeQuotaTx(ctx, tx, sellerID)
}

func (r *postgresQuotaRepository) deductPersonalQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string) (models.QuotaSource, error) {
	var assignedQuota, usedQuota int
	err := tx.QueryRowContext(ctx, `
		SELECT assigned_quota, used_quota
		FROM seller_quotas WHERE seller_id = $1 FOR UPDATE
	`, sellerID).Scan(&assignedQuota, &usedQuota)

	if errors.Is(err, sql.ErrNoRows) {
		var defaultPersonal, defaultFree int
		_ = tx.QueryRowContext(ctx, `SELECT default_personal_quota, COALESCE(default_free_quota, 5) FROM default_quota_configs WHERE id = 1`).Scan(&defaultPersonal, &defaultFree)
		if defaultFree <= 0 {
			defaultFree = 5
		}
		_, err = tx.ExecContext(ctx, `INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, assigned_free_quota, used_free_quota) VALUES ($1, $2, 0, $3, 0)`, sellerID, defaultPersonal, defaultFree)
		if err != nil {
			return "", fmt.Errorf("failed to init seller quota: %w", err)
		}
		assignedQuota, usedQuota = defaultPersonal, 0
	} else if err != nil {
		return "", fmt.Errorf("failed to lock seller quota: %w", err)
	}

	if usedQuota < assignedQuota {
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_quota = used_quota + 1, updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		if err != nil {
			return "", fmt.Errorf("failed to deduct personal quota: %w", err)
		}
		return models.QuotaSourcePersonal, nil
	}

	return "", fmt.Errorf("cuota personal agotada")
}

func (r *postgresQuotaRepository) deductGlobalFreeQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string) (models.QuotaSource, error) {
	var assignedFree, usedFree int
	err := tx.QueryRowContext(ctx, `
		SELECT assigned_free_quota, used_free_quota
		FROM seller_quotas WHERE seller_id = $1 FOR UPDATE
	`, sellerID).Scan(&assignedFree, &usedFree)

	if errors.Is(err, sql.ErrNoRows) {
		var defaultPersonal, defaultFree int
		_ = tx.QueryRowContext(ctx, `SELECT default_personal_quota, COALESCE(default_free_quota, 5) FROM default_quota_configs WHERE id = 1`).Scan(&defaultPersonal, &defaultFree)
		if defaultFree <= 0 {
			defaultFree = 5
		}
		_, err = tx.ExecContext(ctx, `
			INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, assigned_free_quota, used_free_quota)
			VALUES ($1, $2, 0, $3, 0)
		`, sellerID, defaultPersonal, defaultFree)
		if err != nil {
			return "", fmt.Errorf("failed to init seller quota: %w", err)
		}
		assignedFree, usedFree = defaultFree, 0
	} else if err != nil {
		return "", fmt.Errorf("failed to lock seller free quota: %w", err)
	}

	if usedFree < assignedFree {
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET used_free_quota = used_free_quota + 1, updated_at = NOW() WHERE seller_id = $1
		`, sellerID)
		if err != nil {
			return "", fmt.Errorf("failed to deduct seller free quota: %w", err)
		}
		return models.QuotaSourceLibre, nil
	}

	return "", fmt.Errorf("cuota libre del vendedor agotada")
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

	// 2. Ensure all existing sellers/admins in users table have a row in seller_quotas updated to assigned
	_, err = tx.ExecContext(ctx, `
		INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, used_free_quota, updated_at)
		SELECT id, $1, 0, 0, NOW() FROM users WHERE role IN ('SELLER', 'ADMIN')
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

func (r *postgresQuotaRepository) SetSellerFreeQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var previousAssigned int
	err = tx.QueryRowContext(ctx, `SELECT assigned_free_quota FROM seller_quotas WHERE seller_id = $1 FOR UPDATE`, sellerID).
		Scan(&previousAssigned)
	if errors.Is(err, sql.ErrNoRows) {
		previousAssigned = 5
		var defaultQuota int
		_ = tx.QueryRowContext(ctx, `SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).Scan(&defaultQuota)
		_, err = tx.ExecContext(ctx, `
			INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, assigned_free_quota, used_free_quota)
			VALUES ($1, $2, 0, $3, 0)
		`, sellerID, defaultQuota, assigned)
	} else {
		_, err = tx.ExecContext(ctx, `
			UPDATE seller_quotas SET assigned_free_quota = $1, updated_at = NOW() WHERE seller_id = $2
		`, assigned, sellerID)
	}
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO quota_audit_logs (id, admin_id, seller_id, quota_type, previous_assigned, new_assigned, created_at)
		VALUES (gen_random_uuid(), $1, $2, 'FREE', $3, $4, NOW())
	`, adminID, sellerID, previousAssigned, assigned)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *postgresQuotaRepository) SetAllSellersFreeQuota(ctx context.Context, adminID string, assigned int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx, `
		INSERT INTO default_quota_configs (id, default_personal_quota, default_free_quota, updated_at)
		VALUES (1, 0, $1, NOW())
		ON CONFLICT (id) DO UPDATE SET default_free_quota = EXCLUDED.default_free_quota, updated_at = NOW()
	`, assigned)
	if err != nil {
		return fmt.Errorf("failed to update default free quota config: %w", err)
	}

	var defaultPersonal int
	_ = tx.QueryRowContext(ctx, `SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).Scan(&defaultPersonal)

	_, err = tx.ExecContext(ctx, `
		INSERT INTO seller_quotas (seller_id, assigned_quota, used_quota, assigned_free_quota, used_free_quota, updated_at)
		SELECT id, $1, 0, $2, 0, NOW() FROM users WHERE role IN ('SELLER', 'ADMIN')
		ON CONFLICT (seller_id) DO UPDATE SET assigned_free_quota = EXCLUDED.assigned_free_quota, updated_at = NOW()
	`, defaultPersonal, assigned)
	if err != nil {
		return fmt.Errorf("failed to update free quotas for all sellers: %w", err)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO quota_audit_logs (id, admin_id, seller_id, quota_type, previous_assigned, new_assigned, created_at)
		VALUES (gen_random_uuid(), $1, NULL, 'FREE', 0, $2, NOW())
	`, adminID, assigned)
	if err != nil {
		return fmt.Errorf("failed to insert audit log: %w", err)
	}

	return tx.Commit()
}

func (r *postgresQuotaRepository) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	return r.SetAllSellersFreeQuota(ctx, adminID, totalFree)
}

func (r *postgresQuotaRepository) GetDefaultQuotaConfig(ctx context.Context) (*models.DefaultQuotaConfig, error) {
	cfg := &models.DefaultQuotaConfig{ID: 1, DefaultPersonalQuota: 0, DefaultFreeQuota: 5}
	err := r.db.QueryRowContext(ctx, `SELECT default_personal_quota, COALESCE(default_free_quota, 5) FROM default_quota_configs WHERE id = 1`).Scan(&cfg.DefaultPersonalQuota, &cfg.DefaultFreeQuota)
	if errors.Is(err, sql.ErrNoRows) {
		return cfg, nil
	}
	return cfg, err
}

func (r *postgresQuotaRepository) GetAllSellersQuotas(ctx context.Context) ([]*models.SellerQuotaDetail, error) {
	query := `
		SELECT u.id, u.name, u.email,
		       COALESCE(sq.assigned_quota, (SELECT default_personal_quota FROM default_quota_configs WHERE id = 1), 0),
		       COALESCE(sq.used_quota, 0),
		       COALESCE(sq.assigned_free_quota, (SELECT COALESCE(default_free_quota, 5) FROM default_quota_configs WHERE id = 1), 5),
		       COALESCE(sq.used_free_quota, 0),
		       COALESCE(sq.updated_at, u.created_at)
		FROM users u
		LEFT JOIN seller_quotas sq ON u.id = sq.seller_id
		WHERE u.role IN ('SELLER', 'ADMIN')
		ORDER BY u.name ASC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []*models.SellerQuotaDetail{}
	for rows.Next() {
		sq := &models.SellerQuotaDetail{}
		var defaultOrAssigned int
		err := rows.Scan(&sq.SellerID, &sq.SellerName, &sq.SellerEmail, &defaultOrAssigned, &sq.UsedQuota, &sq.AssignedFreeQuota, &sq.UsedFreeQuota, &sq.UpdatedAt)
		if err != nil {
			return nil, err
		}
		sq.AssignedQuota = defaultOrAssigned
		sq.RemainingPersonal = sq.AssignedQuota - sq.UsedQuota
		if sq.RemainingPersonal < 0 {
			sq.RemainingPersonal = 0
		}
		sq.IsPersonalExhausted = sq.RemainingPersonal == 0

		sq.RemainingFree = sq.AssignedFreeQuota - sq.UsedFreeQuota
		if sq.RemainingFree < 0 {
			sq.RemainingFree = 0
		}
		sq.IsFreeExhausted = sq.RemainingFree == 0

		list = append(list, sq)
	}
	return list, rows.Err()
}

func (r *postgresQuotaRepository) GetFreeQuotaUsageBySeller(ctx context.Context) ([]*models.SellerFreeQuotaUsage, error) {
	query := `
		SELECT u.id, u.name, u.email, COALESCE(sq.assigned_free_quota, 5), COALESCE(sq.used_free_quota, 0)
		FROM users u
		LEFT JOIN seller_quotas sq ON u.id = sq.seller_id
		WHERE u.role IN ('SELLER', 'ADMIN')
		ORDER BY sq.used_free_quota DESC NULLS LAST
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []*models.SellerFreeQuotaUsage{}
	for rows.Next() {
		item := &models.SellerFreeQuotaUsage{}
		if err := rows.Scan(&item.SellerID, &item.SellerName, &item.SellerEmail, &item.AssignedFreeQuota, &item.UsedFreeQuota); err != nil {
			return nil, err
		}
		item.RemainingFree = item.AssignedFreeQuota - item.UsedFreeQuota
		if item.RemainingFree < 0 {
			item.RemainingFree = 0
		}
		list = append(list, item)
	}
	return list, rows.Err()
}
