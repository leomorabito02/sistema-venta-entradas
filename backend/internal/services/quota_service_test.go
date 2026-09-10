package services_test

import (
	"context"
	"testing"

	"backend/internal/models"
	"backend/internal/services"
)

func setupQuotaServiceTest() (services.QuotaService, *MockQuotaRepository, *MockUserRepository) {
	quotaRepo := NewMockQuotaRepository()
	userRepo := NewMockUserRepository()

	seller := &models.User{
		ID:     "seller-uuid-1",
		Name:   "Seller One",
		Email:  "seller1@example.com",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	userRepo.Users[seller.ID] = seller
	quotaRepo.SellerQuotas[seller.ID] = &models.SellerQuota{
		SellerID:      seller.ID,
		AssignedQuota: 20,
		UsedQuota:     5,
		UsedFreeQuota: 2,
	}

	svc := services.NewQuotaService(quotaRepo, userRepo)
	return svc, quotaRepo, userRepo
}

func TestQuotaService_GetSellerQuotaSummary(t *testing.T) {
	svc, _, _ := setupQuotaServiceTest()
	ctx := context.Background()

	// Empty seller ID
	_, err := svc.GetSellerQuotaSummary(ctx, "")
	if err == nil {
		t.Errorf("Expected error for empty seller ID")
	}

	// Non-existent seller
	_, err = svc.GetSellerQuotaSummary(ctx, "unknown-seller")
	if err == nil {
		t.Errorf("Expected error for non-existent seller")
	}

	// Valid seller
	summary, err := svc.GetSellerQuotaSummary(ctx, "seller-uuid-1")
	if err != nil {
		t.Fatalf("GetSellerQuotaSummary failed: %v", err)
	}

	if summary.AssignedQuota != 20 {
		t.Errorf("Expected AssignedQuota 20, got %d", summary.AssignedQuota)
	}
	if summary.UsedQuota != 5 {
		t.Errorf("Expected UsedQuota 5, got %d", summary.UsedQuota)
	}
	if summary.AvailableQuota != 15 {
		t.Errorf("Expected AvailableQuota 15, got %d", summary.AvailableQuota)
	}
}

func TestQuotaService_GlobalFreeQuotaSummary(t *testing.T) {
	svc, _, _ := setupQuotaServiceTest()
	ctx := context.Background()

	summary, err := svc.GetGlobalFreeQuotaSummary(ctx)
	if err != nil {
		t.Fatalf("GetGlobalFreeQuotaSummary failed: %v", err)
	}

	if summary.TotalFreeQuota != 100 {
		t.Errorf("Expected TotalFreeQuota 100, got %d", summary.TotalFreeQuota)
	}
	if summary.UsedFreeQuota != 10 {
		t.Errorf("Expected UsedFreeQuota 10, got %d", summary.UsedFreeQuota)
	}
	if summary.AvailableQuota != 90 {
		t.Errorf("Expected AvailableQuota 90, got %d", summary.AvailableQuota)
	}
}

func TestQuotaService_SetQuotaValidations(t *testing.T) {
	svc, _, _ := setupQuotaServiceTest()
	ctx := context.Background()

	// SetSellerQuota validations
	if err := svc.SetSellerQuota(ctx, "admin-id", "", 10); err == nil {
		t.Errorf("Expected error for empty seller ID")
	}
	if err := svc.SetSellerQuota(ctx, "admin-id", "seller-uuid-1", -1); err == nil {
		t.Errorf("Expected error for negative assigned quota")
	}
	if err := svc.SetSellerQuota(ctx, "admin-id", "seller-uuid-1", 30); err != nil {
		t.Errorf("Unexpected error setting seller quota: %v", err)
	}

	// SetAllSellersPersonalQuota validations
	if err := svc.SetAllSellersPersonalQuota(ctx, "admin-id", -5); err == nil {
		t.Errorf("Expected error for negative assigned quota")
	}
	if err := svc.SetAllSellersPersonalQuota(ctx, "admin-id", 25); err != nil {
		t.Errorf("Unexpected error setting all seller personal quota: %v", err)
	}

	// SetGlobalFreeQuota validations
	if err := svc.SetGlobalFreeQuota(ctx, "admin-id", -10); err == nil {
		t.Errorf("Expected error for negative global free quota")
	}
	if err := svc.SetGlobalFreeQuota(ctx, "admin-id", 200); err != nil {
		t.Errorf("Unexpected error setting global free quota: %v", err)
	}
}

func TestQuotaService_DefaultQuotaConfig(t *testing.T) {
	svc, _, _ := setupQuotaServiceTest()
	ctx := context.Background()

	cfg, err := svc.GetDefaultQuotaConfig(ctx)
	if err != nil {
		t.Fatalf("GetDefaultQuotaConfig failed: %v", err)
	}
	if cfg.DefaultPersonalQuota != 20 {
		t.Errorf("Expected DefaultPersonalQuota 20, got %d", cfg.DefaultPersonalQuota)
	}

	if err := svc.UpdateDefaultQuotaConfig(ctx, "admin-id", -1); err == nil {
		t.Errorf("Expected error for negative default quota")
	}

	if err := svc.UpdateDefaultQuotaConfig(ctx, "admin-id", 50); err != nil {
		t.Errorf("Unexpected error updating default quota config: %v", err)
	}
}

func TestQuotaService_AdminOverviewAndExhaustedSellers(t *testing.T) {
	svc, _, _ := setupQuotaServiceTest()
	ctx := context.Background()

	overview, err := svc.GetAdminQuotaOverview(ctx)
	if err != nil {
		t.Fatalf("GetAdminQuotaOverview failed: %v", err)
	}
	if overview.DefaultPersonalQuota != 20 {
		t.Errorf("Expected DefaultPersonalQuota 20, got %d", overview.DefaultPersonalQuota)
	}

	exhausted, err := svc.GetExhaustedSellers(ctx)
	if err != nil {
		t.Fatalf("GetExhaustedSellers failed: %v", err)
	}
	if exhausted == nil {
		t.Errorf("Expected non-nil slice for exhausted sellers")
	}
}
