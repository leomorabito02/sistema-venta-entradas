package repository

import (
	"context"
	"testing"
	"time"

	"backend/internal/models"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestQuotaRepository_GetSellerQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"seller_id", "assigned_quota", "used_quota", "assigned_free_quota", "used_free_quota", "updated_at",
	}).AddRow("seller-1", 10, 2, 5, 1, now)

	mock.ExpectQuery(`SELECT seller_id, assigned_quota, used_quota`).
		WithArgs("seller-1").
		WillReturnRows(rows)

	q, err := repo.GetSellerQuota(ctx, "seller-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if q.AssignedQuota != 10 || q.UsedQuota != 2 || q.AssignedFreeQuota != 5 {
		t.Errorf("unexpected quota values: %v", q)
	}
}

func TestQuotaRepository_GetGlobalFreeQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	rows := sqlmock.NewRows([]string{"total", "used"}).AddRow(100, 20)
	mock.ExpectQuery(`SELECT COALESCE\(SUM\(assigned_free_quota\)`).WillReturnRows(rows)

	g, err := repo.GetGlobalFreeQuota(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if g.TotalFreeQuota != 100 || g.UsedFreeQuota != 20 {
		t.Errorf("unexpected global free quota: %v", g)
	}
}

func TestQuotaRepository_DeductPresaleQuotaTx_Personal(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	// Lock seller quota row -> assigned 10, used 2
	rows := sqlmock.NewRows([]string{"assigned_quota", "used_quota"}).AddRow(10, 2)
	mock.ExpectQuery(`SELECT assigned_quota, used_quota FROM seller_quotas WHERE seller_id = \$1 FOR UPDATE`).
		WithArgs("seller-1").
		WillReturnRows(rows)

	mock.ExpectExec(`UPDATE seller_quotas SET used_quota = used_quota \+ 1`).
		WithArgs("seller-1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	qs, err := repo.DeductPresaleQuotaTx(ctx, tx, "seller-1", models.QuotaSourcePersonal)
	if err != nil {
		t.Fatalf("expected success, got %v", err)
	}
	if qs != models.QuotaSourcePersonal {
		t.Errorf("expected QuotaSourcePersonal, got %s", qs)
	}
}

func TestQuotaRepository_DeductPresaleQuotaTx_Free(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	rows := sqlmock.NewRows([]string{"assigned_free_quota", "used_free_quota"}).AddRow(5, 1)
	mock.ExpectQuery(`SELECT assigned_free_quota, used_free_quota FROM seller_quotas WHERE seller_id = \$1 FOR UPDATE`).
		WithArgs("seller-1").
		WillReturnRows(rows)

	mock.ExpectExec(`UPDATE seller_quotas SET used_free_quota = used_free_quota \+ 1`).
		WithArgs("seller-1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	qs, err := repo.DeductPresaleQuotaTx(ctx, tx, "seller-1", models.QuotaSourceLibre)
	if err != nil {
		t.Fatalf("expected success, got %v", err)
	}
	if qs != models.QuotaSourceLibre {
		t.Errorf("expected QuotaSourceLibre, got %s", qs)
	}
}

func TestQuotaRepository_RestoreQuotaTx(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx: %v", err)
	}

	mock.ExpectExec(`UPDATE seller_quotas SET used_quota = GREATEST\(0, used_quota - 1\)`).
		WithArgs("seller-1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	err = repo.RestoreQuotaTx(ctx, tx, "seller-1", models.QuotaSourcePersonal)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestQuotaRepository_SetSellerQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	rows := sqlmock.NewRows([]string{"assigned_quota"}).AddRow(10)
	mock.ExpectQuery(`SELECT assigned_quota FROM seller_quotas WHERE seller_id = \$1 FOR UPDATE`).
		WithArgs("seller-1").
		WillReturnRows(rows)

	mock.ExpectExec(`UPDATE seller_quotas SET assigned_quota = \$1, updated_at = NOW\(\) WHERE seller_id = \$2`).
		WithArgs(25, "seller-1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectExec(`INSERT INTO quota_audit_logs`).
		WithArgs("admin-1", "seller-1", 10, 25).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectCommit()

	err = repo.SetSellerQuota(ctx, "admin-1", "seller-1", 25)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestQuotaRepository_SetAllSellersPersonalQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()

	mock.ExpectExec(`INSERT INTO default_quota_configs`).
		WithArgs(20).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectExec(`INSERT INTO seller_quotas`).
		WithArgs(20).
		WillReturnResult(sqlmock.NewResult(0, 2))

	mock.ExpectExec(`INSERT INTO quota_audit_logs`).
		WithArgs("admin-1", 20).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectCommit()

	err = repo.SetAllSellersPersonalQuota(ctx, "admin-1", 20)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestQuotaRepository_GetDefaultQuotaConfig(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	rows := sqlmock.NewRows([]string{"default_personal_quota", "default_free_quota"}).AddRow(15, 5)
	mock.ExpectQuery(`SELECT default_personal_quota`).WillReturnRows(rows)

	cfg, err := repo.GetDefaultQuotaConfig(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if cfg.DefaultPersonalQuota != 15 || cfg.DefaultFreeQuota != 5 {
		t.Errorf("unexpected default quota config: %v", cfg)
	}
}

func TestQuotaRepository_SetSellerFreeQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	rows := sqlmock.NewRows([]string{"assigned_free_quota"}).AddRow(5)
	mock.ExpectQuery(`SELECT assigned_free_quota FROM seller_quotas WHERE seller_id = \$1 FOR UPDATE`).
		WithArgs("seller-1").
		WillReturnRows(rows)

	mock.ExpectExec(`UPDATE seller_quotas SET assigned_free_quota = \$1, updated_at = NOW\(\) WHERE seller_id = \$2`).
		WithArgs(10, "seller-1").
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectExec(`INSERT INTO quota_audit_logs`).
		WithArgs("admin-1", "seller-1", 5, 10).
		WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectCommit()

	err = repo.SetSellerFreeQuota(ctx, "admin-1", "seller-1", 10)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestQuotaRepository_GetAllSellersQuotas(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	now := time.Now()
	rows := sqlmock.NewRows([]string{
		"id", "name", "email", "assigned_quota", "used_quota", "assigned_free_quota", "used_free_quota", "updated_at",
	}).AddRow("s1", "Seller One", "s1@example.com", 20, 5, 5, 1, now)

	mock.ExpectQuery(`SELECT u\.id, u\.name, u\.email.*FROM users u`).WillReturnRows(rows)

	list, err := repo.GetAllSellersQuotas(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(list) != 1 || list[0].SellerID != "s1" {
		t.Errorf("unexpected seller quotas list: %v", list)
	}
}

func TestQuotaRepository_GetFreeQuotaUsageBySeller(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	rows := sqlmock.NewRows([]string{
		"id", "name", "email", "assigned_free_quota", "used_free_quota",
	}).AddRow("s1", "Seller One", "s1@example.com", 5, 2)

	mock.ExpectQuery(`SELECT u\.id, u\.name, u\.email, COALESCE\(sq\.assigned_free_quota, 5\).*FROM users u`).WillReturnRows(rows)

	list, err := repo.GetFreeQuotaUsageBySeller(ctx)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(list) != 1 || list[0].UsedFreeQuota != 2 {
		t.Errorf("unexpected free quota usage list: %v", list)
	}
}

func TestQuotaRepository_SetAllSellersFreeQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO default_quota_configs`).
		WithArgs(10).
		WillReturnResult(sqlmock.NewResult(0, 1))

	rows := sqlmock.NewRows([]string{"default_personal_quota"}).AddRow(15)
	mock.ExpectQuery(`SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).
		WillReturnRows(rows)

	mock.ExpectExec(`INSERT INTO seller_quotas`).
		WithArgs(15, 10).
		WillReturnResult(sqlmock.NewResult(0, 2))

	mock.ExpectExec(`INSERT INTO quota_audit_logs`).
		WithArgs("admin-1", 10).
		WillReturnResult(sqlmock.NewResult(0, 1))
	mock.ExpectCommit()

	err = repo.SetAllSellersFreeQuota(ctx, "admin-1", 10)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestQuotaRepository_SetGlobalFreeQuota(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewQuotaRepository(db)
	ctx := context.Background()

	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO default_quota_configs`).
		WithArgs(50).
		WillReturnResult(sqlmock.NewResult(0, 1))

	rows := sqlmock.NewRows([]string{"default_personal_quota"}).AddRow(15)
	mock.ExpectQuery(`SELECT default_personal_quota FROM default_quota_configs WHERE id = 1`).
		WillReturnRows(rows)

	mock.ExpectExec(`INSERT INTO seller_quotas`).
		WithArgs(15, 50).
		WillReturnResult(sqlmock.NewResult(0, 2))

	mock.ExpectExec(`INSERT INTO quota_audit_logs`).
		WithArgs("admin-1", 50).
		WillReturnResult(sqlmock.NewResult(0, 1))
	mock.ExpectCommit()

	err = repo.SetGlobalFreeQuota(ctx, "admin-1", 50)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}
