package controllers

import (
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

	switch req.QuotaType {
	case "PERSONAL":
		if req.SellerID != nil && *req.SellerID != "" && *req.SellerID != "ALL" {
			if err := c.quotaService.SetSellerQuota(r.Context(), adminID, *req.SellerID, req.AssignedQuota); err != nil {
				c.jsonView.Error(w, 0, "", err)
				return
			}
		} else {
			if err := c.quotaService.SetAllSellersPersonalQuota(r.Context(), adminID, req.AssignedQuota); err != nil {
				c.jsonView.Error(w, 0, "", err)
				return
			}
		}
	case "FREE":
		if err := c.quotaService.SetGlobalFreeQuota(r.Context(), adminID, req.AssignedQuota); err != nil {
			c.jsonView.Error(w, 0, "", err)
			return
		}
	}

	c.jsonView.Success(w, http.StatusOK, "Quota updated successfully", nil)
}
