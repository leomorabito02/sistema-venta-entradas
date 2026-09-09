package services

import (
	"context"

	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/repository"
)

type QuotaService interface {
	GetSellerQuotaSummary(ctx context.Context, sellerID string) (*dto.SellerQuotaSummaryResponse, error)
	GetGlobalFreeQuotaSummary(ctx context.Context) (*dto.GlobalFreeQuotaResponse, error)
	SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error
	SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error
	SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error
}

type quotaService struct {
	quotaRepo repository.QuotaRepository
	userRepo  repository.UserRepository
}

func NewQuotaService(quotaRepo repository.QuotaRepository, userRepo repository.UserRepository) QuotaService {
	return &quotaService{
		quotaRepo: quotaRepo,
		userRepo:  userRepo,
	}
}

func (s *quotaService) GetSellerQuotaSummary(ctx context.Context, sellerID string) (*dto.SellerQuotaSummaryResponse, error) {
	if sellerID == "" {
		return nil, models.NewBadRequestError("Seller ID is required", nil)
	}

	u, err := s.userRepo.GetByID(ctx, sellerID)
	if err != nil {
		return nil, models.NewNotFoundError("Seller not found", err)
	}

	q, err := s.quotaRepo.GetSellerQuota(ctx, sellerID)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch seller quota", err)
	}

	available := q.AssignedQuota - q.UsedQuota
	if available < 0 {
		available = 0
	}

	return &dto.SellerQuotaSummaryResponse{
		SellerID:       sellerID,
		SellerName:     u.Name,
		AssignedQuota:  q.AssignedQuota,
		UsedQuota:      q.UsedQuota,
		AvailableQuota: available,
		UsedFreeQuota:  q.UsedFreeQuota,
	}, nil
}

func (s *quotaService) GetGlobalFreeQuotaSummary(ctx context.Context) (*dto.GlobalFreeQuotaResponse, error) {
	q, err := s.quotaRepo.GetGlobalFreeQuota(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch global free quota pool", err)
	}

	available := q.TotalFreeQuota - q.UsedFreeQuota
	if available < 0 {
		available = 0
	}

	return &dto.GlobalFreeQuotaResponse{
		TotalFreeQuota: q.TotalFreeQuota,
		UsedFreeQuota:  q.UsedFreeQuota,
		AvailableQuota: available,
	}, nil
}

func (s *quotaService) SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	if sellerID == "" {
		return models.NewBadRequestError("Seller ID is required", nil)
	}
	if assigned < 0 {
		return models.NewBadRequestError("Assigned quota must be non-negative (>= 0)", nil)
	}
	return s.quotaRepo.SetSellerQuota(ctx, adminID, sellerID, assigned)
}

func (s *quotaService) SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error {
	if assigned < 0 {
		return models.NewBadRequestError("Assigned quota must be non-negative (>= 0)", nil)
	}
	return s.quotaRepo.SetAllSellersPersonalQuota(ctx, adminID, assigned)
}

func (s *quotaService) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	if totalFree < 0 {
		return models.NewBadRequestError("Total free quota must be non-negative (>= 0)", nil)
	}
	return s.quotaRepo.SetGlobalFreeQuota(ctx, adminID, totalFree)
}
