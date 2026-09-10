package dto

import (
	"fmt"

	"backend/internal/models"
)

type UpdateQuotaRequest struct {
	QuotaType    models.QuotaType `json:"quota_type"` // PERSONAL or FREE
	SellerID     *string          `json:"seller_id,omitempty"`
	AssignedQuota int             `json:"assigned_quota"`
}

func (r *UpdateQuotaRequest) Validate() error {
	if r.AssignedQuota < 0 {
		return fmt.Errorf("assigned_quota must be non-negative (>= 0)")
	}

	switch r.QuotaType {
	case models.QuotaTypePersonal, models.QuotaTypeFree:
	default:
		return fmt.Errorf("invalid quota_type: %s (must be PERSONAL or FREE)", r.QuotaType)
	}

	return nil
}

type SellerQuotaSummaryResponse struct {
	SellerID           string `json:"seller_id"`
	SellerName         string `json:"seller_name"`
	AssignedQuota      int    `json:"assigned_quota"`
	UsedQuota          int    `json:"used_quota"`
	AvailableQuota     int    `json:"available_quota"`
	AssignedFreeQuota  int    `json:"assigned_free_quota"`
	UsedFreeQuota      int    `json:"used_free_quota"`
	AvailableFreeQuota int    `json:"available_free_quota"`
}

type GlobalFreeQuotaResponse struct {
	TotalFreeQuota int `json:"total_free_quota"`
	UsedFreeQuota  int `json:"used_free_quota"`
	AvailableQuota int `json:"available_quota"`
}

type DefaultQuotaConfigResponse struct {
	DefaultPersonalQuota int `json:"default_personal_quota"`
	DefaultFreeQuota     int `json:"default_free_quota"`
}

type UpdateDefaultQuotaRequest struct {
	DefaultPersonalQuota *int `json:"default_personal_quota,omitempty"`
	DefaultFreeQuota     *int `json:"default_free_quota,omitempty"`
}

func (r *UpdateDefaultQuotaRequest) Validate() error {
	if r.DefaultPersonalQuota != nil && *r.DefaultPersonalQuota < 0 {
		return fmt.Errorf("default_personal_quota must be non-negative (>= 0)")
	}
	if r.DefaultFreeQuota != nil && *r.DefaultFreeQuota < 0 {
		return fmt.Errorf("default_free_quota must be non-negative (>= 0)")
	}
	return nil
}

type AdminQuotaOverviewResponse struct {
	DefaultPersonalQuota   int                             `json:"default_personal_quota"`
	DefaultFreeQuota       int                             `json:"default_free_quota"`
	GlobalFreeQuota        GlobalFreeQuotaResponse         `json:"global_free_quota"`
	SellersQuotas          []*models.SellerQuotaDetail     `json:"sellers_quotas"`
	FreeQuotaUsageBySeller []*models.SellerFreeQuotaUsage  `json:"free_quota_usage_by_seller"`
	ExhaustedSellers       []*models.SellerQuotaDetail     `json:"exhausted_sellers"`
}
