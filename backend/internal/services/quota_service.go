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
	SetSellerFreeQuota(ctx context.Context, adminID string, sellerID string, assigned int) error
	SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error
	GetDefaultQuotaConfig(ctx context.Context) (*dto.DefaultQuotaConfigResponse, error)
	UpdateDefaultQuotaConfig(ctx context.Context, adminID string, req *dto.UpdateDefaultQuotaRequest) error
	GetAdminQuotaOverview(ctx context.Context) (*dto.AdminQuotaOverviewResponse, error)
	GetExhaustedSellers(ctx context.Context) ([]*models.SellerQuotaDetail, error)
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

	availableFree := q.AssignedFreeQuota - q.UsedFreeQuota
	if availableFree < 0 {
		availableFree = 0
	}

	return &dto.SellerQuotaSummaryResponse{
		SellerID:           sellerID,
		SellerName:         u.Name,
		AssignedQuota:      q.AssignedQuota,
		UsedQuota:          q.UsedQuota,
		AvailableQuota:     available,
		AssignedFreeQuota:  q.AssignedFreeQuota,
		UsedFreeQuota:      q.UsedFreeQuota,
		AvailableFreeQuota: availableFree,
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

func (s *quotaService) SetSellerFreeQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	if sellerID == "" {
		return models.NewBadRequestError("Seller ID is required", nil)
	}
	if assigned < 0 {
		return models.NewBadRequestError("Assigned free quota must be non-negative (>= 0)", nil)
	}
	return s.quotaRepo.SetSellerFreeQuota(ctx, adminID, sellerID, assigned)
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
	return s.quotaRepo.SetAllSellersFreeQuota(ctx, adminID, totalFree)
}

func (s *quotaService) GetDefaultQuotaConfig(ctx context.Context) (*dto.DefaultQuotaConfigResponse, error) {
	cfg, err := s.quotaRepo.GetDefaultQuotaConfig(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch default quota config", err)
	}
	return &dto.DefaultQuotaConfigResponse{
		DefaultPersonalQuota: cfg.DefaultPersonalQuota,
		DefaultFreeQuota:     cfg.DefaultFreeQuota,
	}, nil
}

func (s *quotaService) UpdateDefaultQuotaConfig(ctx context.Context, adminID string, req *dto.UpdateDefaultQuotaRequest) error {
	if req == nil {
		return models.NewBadRequestError("Invalid request payload", nil)
	}
	if err := req.Validate(); err != nil {
		return models.NewBadRequestError(err.Error(), err)
	}
	if req.DefaultPersonalQuota != nil {
		if err := s.quotaRepo.SetAllSellersPersonalQuota(ctx, adminID, *req.DefaultPersonalQuota); err != nil {
			return err
		}
	}
	if req.DefaultFreeQuota != nil {
		if err := s.quotaRepo.SetAllSellersFreeQuota(ctx, adminID, *req.DefaultFreeQuota); err != nil {
			return err
		}
	}
	return nil
}

func (s *quotaService) GetAdminQuotaOverview(ctx context.Context) (*dto.AdminQuotaOverviewResponse, error) {
	defaultCfg, err := s.quotaRepo.GetDefaultQuotaConfig(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch default quota config", err)
	}

	freeSummary, err := s.GetGlobalFreeQuotaSummary(ctx)
	if err != nil {
		return nil, err
	}

	sellersQuotas, err := s.quotaRepo.GetAllSellersQuotas(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch sellers quotas", err)
	}

	freeUsage, err := s.quotaRepo.GetFreeQuotaUsageBySeller(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch free quota usage", err)
	}

	exhausted := []*models.SellerQuotaDetail{}
	for _, sq := range sellersQuotas {
		if sq.IsPersonalExhausted {
			exhausted = append(exhausted, sq)
		}
	}

	return &dto.AdminQuotaOverviewResponse{
		DefaultPersonalQuota:   defaultCfg.DefaultPersonalQuota,
		DefaultFreeQuota:       defaultCfg.DefaultFreeQuota,
		GlobalFreeQuota:        *freeSummary,
		SellersQuotas:          sellersQuotas,
		FreeQuotaUsageBySeller: freeUsage,
		ExhaustedSellers:       exhausted,
	}, nil
}

func (s *quotaService) GetExhaustedSellers(ctx context.Context) ([]*models.SellerQuotaDetail, error) {
	sellersQuotas, err := s.quotaRepo.GetAllSellersQuotas(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch sellers quotas", err)
	}

	exhausted := []*models.SellerQuotaDetail{}
	for _, sq := range sellersQuotas {
		if sq.IsPersonalExhausted {
			exhausted = append(exhausted, sq)
		}
	}
	return exhausted, nil
}
