package controllers

import (
	"context"
	"encoding/json"
	"net/http"

	"backend/internal/dto"
	"backend/internal/services"
	"backend/internal/views"
)

type QuotaController struct {
	quotaService services.QuotaService
	jsonView     *views.JSONView
}

func NewQuotaController(quotaService services.QuotaService, jsonView *views.JSONView) *QuotaController {
	return &QuotaController{
		quotaService: quotaService,
		jsonView:     jsonView,
	}
}

func (c *QuotaController) GetSellerQuota(w http.ResponseWriter, r *http.Request) {
	sellerID := r.PathValue("id")
	if sellerID == "" {
		c.jsonView.Error(w, http.StatusBadRequest, "Seller ID path parameter is required", nil)
		return
	}

	summary, err := c.quotaService.GetSellerQuotaSummary(r.Context(), sellerID)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Seller quota retrieved successfully", summary)
}

func (c *QuotaController) GetGlobalFreeQuota(w http.ResponseWriter, r *http.Request) {
	summary, err := c.quotaService.GetGlobalFreeQuotaSummary(r.Context())
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Global free quota retrieved successfully", summary)
}

func isSpecificSeller(sellerID *string) bool {
	return sellerID != nil && *sellerID != "" && *sellerID != "ALL"
}

func (c *QuotaController) updatePersonalQuota(ctx context.Context, adminID string, req *dto.UpdateQuotaRequest) error {
	if isSpecificSeller(req.SellerID) {
		return c.quotaService.SetSellerQuota(ctx, adminID, *req.SellerID, req.AssignedQuota)
	}
	return c.quotaService.SetAllSellersPersonalQuota(ctx, adminID, req.AssignedQuota)
}

func (c *QuotaController) updateFreeQuota(ctx context.Context, adminID string, req *dto.UpdateQuotaRequest) error {
	if isSpecificSeller(req.SellerID) {
		return c.quotaService.SetSellerFreeQuota(ctx, adminID, *req.SellerID, req.AssignedQuota)
	}
	return c.quotaService.SetGlobalFreeQuota(ctx, adminID, req.AssignedQuota)
}

func (c *QuotaController) UpdateQuota(w http.ResponseWriter, r *http.Request) {
	adminID := r.Header.Get("X-User-ID")
	if adminID == "" {
		adminID = "00000000-0000-0000-0000-000000000000"
	}

	var req dto.UpdateQuotaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, "Invalid request payload format", err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	var err error
	switch req.QuotaType {
	case "PERSONAL":
		err = c.updatePersonalQuota(r.Context(), adminID, &req)
	case "FREE":
		err = c.updateFreeQuota(r.Context(), adminID, &req)
	}

	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Quota updated successfully", nil)
}

func (c *QuotaController) GetDefaultQuotaConfig(w http.ResponseWriter, r *http.Request) {
	resp, err := c.quotaService.GetDefaultQuotaConfig(r.Context())
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}
	c.jsonView.Success(w, http.StatusOK, "Default quota config retrieved successfully", resp)
}

func (c *QuotaController) UpdateDefaultQuotaConfig(w http.ResponseWriter, r *http.Request) {
	adminID := r.Header.Get("X-User-ID")
	if adminID == "" {
		adminID = "00000000-0000-0000-0000-000000000000"
	}

	var req dto.UpdateDefaultQuotaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, "Invalid request payload format", err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	if err := c.quotaService.UpdateDefaultQuotaConfig(r.Context(), adminID, &req); err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Default personal quota updated successfully", nil)
}

func (c *QuotaController) GetAdminQuotaOverview(w http.ResponseWriter, r *http.Request) {
	overview, err := c.quotaService.GetAdminQuotaOverview(r.Context())
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}
	c.jsonView.Success(w, http.StatusOK, "Admin quota overview retrieved successfully", overview)
}

func (c *QuotaController) GetExhaustedSellers(w http.ResponseWriter, r *http.Request) {
	exhausted, err := c.quotaService.GetExhaustedSellers(r.Context())
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}
	c.jsonView.Success(w, http.StatusOK, "Exhausted sellers retrieved successfully", exhausted)
}
