package controllers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/controllers"
	"backend/internal/dto"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/views"
)

// MockAuthService implements services.AuthService
type MockAuthService struct {
	UserResp  *dto.UserResponse
	TokenResp *dto.TokenResponse
	Err       error
}

func (m *MockAuthService) GetUserByID(ctx context.Context, id string) (*dto.UserResponse, error) {
	return m.UserResp, m.Err
}
func (m *MockAuthService) AuthenticateGoogleUser(ctx context.Context, email, name, googleID string) (*dto.TokenResponse, error) {
	return m.TokenResp, m.Err
}
func (m *MockAuthService) RotateRefreshToken(ctx context.Context, rawRefreshToken string) (*dto.TokenResponse, error) {
	return m.TokenResp, m.Err
}
func (m *MockAuthService) Logout(ctx context.Context, rawRefreshToken string) error {
	return m.Err
}
func (m *MockAuthService) ListUsers(ctx context.Context) ([]*dto.UserResponse, error) {
	return []*dto.UserResponse{m.UserResp}, m.Err
}
func (m *MockAuthService) UpdateUserStatus(ctx context.Context, id string, status models.UserStatus) error {
	return m.Err
}
func (m *MockAuthService) UpdateUserRole(ctx context.Context, id string, role models.UserRole) error {
	return m.Err
}

// MockTicketService implements services.TicketService
type MockTicketService struct {
	TicketResp *dto.TicketResponse
	PublicResp *dto.TicketPublicResponse
	Prices     []*dto.TicketPriceResponse
	PriceResp  *dto.TicketPriceResponse
	Tickets    []*dto.TicketResponse
	Err        error
}

func (m *MockTicketService) CreateTicket(ctx context.Context, sellerID string, req *dto.CreateTicketRequest) (*dto.TicketResponse, error) {
	return m.TicketResp, m.Err
}
func (m *MockTicketService) GetPublicTicket(ctx context.Context, token string) (*dto.TicketPublicResponse, error) {
	return m.PublicResp, m.Err
}
func (m *MockTicketService) ValidateTicket(ctx context.Context, operatorID string, req *dto.ValidateTicketRequest) (*dto.TicketResponse, error) {
	return m.TicketResp, m.Err
}
func (m *MockTicketService) AnnulTicket(ctx context.Context, operatorID string, ticketID string, reason string) error {
	return m.Err
}
func (m *MockTicketService) GetActivePrices(ctx context.Context) ([]*dto.TicketPriceResponse, error) {
	return m.Prices, m.Err
}
func (m *MockTicketService) UpdatePrice(ctx context.Context, adminID string, req *dto.UpdateTicketPriceRequest) (*dto.TicketPriceResponse, error) {
	return m.PriceResp, m.Err
}
func (m *MockTicketService) ListTickets(ctx context.Context, sellerID string) ([]*dto.TicketResponse, error) {
	return m.Tickets, m.Err
}

// MockQuotaService implements services.QuotaService
type MockQuotaService struct {
	SellerSummary *dto.SellerQuotaSummaryResponse
	GlobalSummary *dto.GlobalFreeQuotaResponse
	DefaultCfg    *dto.DefaultQuotaConfigResponse
	Overview      *dto.AdminQuotaOverviewResponse
	Exhausted     []*models.SellerQuotaDetail
	Err           error
}

func (m *MockQuotaService) GetSellerQuotaSummary(ctx context.Context, sellerID string) (*dto.SellerQuotaSummaryResponse, error) {
	return m.SellerSummary, m.Err
}
func (m *MockQuotaService) GetGlobalFreeQuotaSummary(ctx context.Context) (*dto.GlobalFreeQuotaResponse, error) {
	return m.GlobalSummary, m.Err
}
func (m *MockQuotaService) SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	return m.Err
}
func (m *MockQuotaService) SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error {
	return m.Err
}
func (m *MockQuotaService) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	return m.Err
}
func (m *MockQuotaService) GetDefaultQuotaConfig(ctx context.Context) (*dto.DefaultQuotaConfigResponse, error) {
	return m.DefaultCfg, m.Err
}
func (m *MockQuotaService) UpdateDefaultQuotaConfig(ctx context.Context, adminID string, defaultQuota int) error {
	return m.Err
}
func (m *MockQuotaService) GetAdminQuotaOverview(ctx context.Context) (*dto.AdminQuotaOverviewResponse, error) {
	return m.Overview, m.Err
}
func (m *MockQuotaService) GetExhaustedSellers(ctx context.Context) ([]*models.SellerQuotaDetail, error) {
	return m.Exhausted, m.Err
}

func TestHealthController(t *testing.T) {
	jsonView := views.NewJSONView()
	ctrl := controllers.NewHealthController(jsonView)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()

	ctrl.Health(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", rec.Code)
	}

	var resp models.Response
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if !resp.Success {
		t.Errorf("Expected success response")
	}
}

func TestAuthController_Handlers(t *testing.T) {
	jsonView := views.NewJSONView()
	mockAuth := &MockAuthService{
		UserResp:  &dto.UserResponse{ID: "u-1", Email: "test@example.com"},
		TokenResp: &dto.TokenResponse{AccessToken: "acc-token", RefreshToken: "ref-token", Status: models.StatusActive},
	}
	ctrl := controllers.NewAuthController(mockAuth, jsonView)

	t.Run("GoogleLogin Invalid JSON -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/google", bytes.NewBufferString("{bad-json"))
		rec := httptest.NewRecorder()

		ctrl.GoogleLogin(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("Refresh Missing Cookie -> 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/refresh", nil)
		rec := httptest.NewRecorder()

		ctrl.Refresh(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401 Unauthorized for missing cookie, got %d", rec.Code)
		}
	})

	t.Run("Refresh Success", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/refresh", nil)
		req.AddCookie(&http.Cookie{Name: "refresh_token", Value: "valid-refresh"})
		rec := httptest.NewRecorder()

		ctrl.Refresh(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK, got %d", rec.Code)
		}
	})

	t.Run("Logout Handler", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/logout", nil)
		req.AddCookie(&http.Cookie{Name: "refresh_token", Value: "logout-refresh"})
		rec := httptest.NewRecorder()

		ctrl.Logout(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK on logout, got %d", rec.Code)
		}
	})

	t.Run("UpdateUserStatus Missing ID -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPut, "/api/v1/users//status", nil)
		rec := httptest.NewRecorder()

		ctrl.UpdateUserStatus(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("UpdateUserStatus Handler Success", func(t *testing.T) {
		statusReq := dto.UpdateUserStatusRequest{Status: models.StatusActive}
		body, _ := json.Marshal(statusReq)

		req := httptest.NewRequest(http.MethodPut, "/api/v1/users/u-1/status", bytes.NewReader(body))
		req.SetPathValue("id", "u-1")
		rec := httptest.NewRecorder()

		ctrl.UpdateUserStatus(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdateUserStatus, got %d", rec.Code)
		}
	})

	t.Run("UpdateUserRole Missing ID -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPut, "/api/v1/users//role", nil)
		rec := httptest.NewRecorder()

		ctrl.UpdateUserRole(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("UpdateUserRole Handler Success", func(t *testing.T) {
		roleReq := dto.UpdateUserRoleRequest{Role: models.RoleAdmin}
		body, _ := json.Marshal(roleReq)

		req := httptest.NewRequest(http.MethodPut, "/api/v1/users/u-1/role", bytes.NewReader(body))
		req.SetPathValue("id", "u-1")
		rec := httptest.NewRecorder()

		ctrl.UpdateUserRole(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdateUserRole, got %d", rec.Code)
		}
	})

	t.Run("ListUsers Handler", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/users", nil)
		rec := httptest.NewRecorder()

		ctrl.ListUsers(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for ListUsers, got %d", rec.Code)
		}
	})
}

func TestTicketController_Handlers(t *testing.T) {
	jsonView := views.NewJSONView()
	mockTicketSvc := &MockTicketService{
		TicketResp: &dto.TicketResponse{ID: "t-123", TicketNumber: 100, Status: models.TicketStatusUsadoEntrada},
		PublicResp: &dto.TicketPublicResponse{TicketNumber: 100, PublicToken: "tok-123"},
		Prices:     []*dto.TicketPriceResponse{{TicketType: models.TicketTypeSimple, Price: 1000}},
		PriceResp:  &dto.TicketPriceResponse{TicketType: models.TicketTypeSimple, Price: 1200},
		Tickets:    []*dto.TicketResponse{{ID: "t-1"}},
	}
	ctrl := controllers.NewTicketController(mockTicketSvc, jsonView)

	t.Run("CreateTicket Missing Seller ID -> 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/tickets", nil)
		rec := httptest.NewRecorder()

		ctrl.CreateTicket(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401, got %d", rec.Code)
		}
	})

	t.Run("CreateTicket Invalid Payload -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/tickets", bytes.NewBufferString("{bad-json"))
		req.Header.Set("X-User-ID", "seller-1")
		rec := httptest.NewRecorder()

		ctrl.CreateTicket(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("ListTickets Missing Seller ID -> 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/tickets", nil)
		rec := httptest.NewRecorder()

		ctrl.ListTickets(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401, got %d", rec.Code)
		}
	})

	t.Run("ListTickets Success as Seller", func(t *testing.T) {
		user := &models.User{ID: "seller-1", Role: models.RoleSeller, Status: models.StatusActive}
		req := httptest.NewRequest(http.MethodGet, "/api/v1/tickets", nil)
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, user)
		rec := httptest.NewRecorder()

		ctrl.ListTickets(rec, req.WithContext(ctx))

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK, got %d", rec.Code)
		}
	})

	t.Run("GetPublicTicket Missing Token Path -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/tickets/public/", nil)
		rec := httptest.NewRecorder()

		ctrl.GetPublicTicket(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("GetPublicTicket Success", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/tickets/public/tok-123", nil)
		req.SetPathValue("token", "tok-123")
		rec := httptest.NewRecorder()

		ctrl.GetPublicTicket(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetPublicTicket, got %d", rec.Code)
		}
	})

	t.Run("ValidateTicket Missing Operator ID -> 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/tickets/validate", nil)
		rec := httptest.NewRecorder()

		ctrl.ValidateTicket(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401, got %d", rec.Code)
		}
	})

	t.Run("ValidateTicket Handler Success", func(t *testing.T) {
		valReq := dto.ValidateTicketRequest{
			FourDigitCode:  "1234",
			ValidationType: models.ValidationTypeEntrada,
		}
		body, _ := json.Marshal(valReq)

		user := &models.User{ID: "operator-1", Role: models.RoleSeller, Status: models.StatusActive}
		req := httptest.NewRequest(http.MethodPost, "/api/v1/tickets/validate", bytes.NewReader(body))
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, user)
		rec := httptest.NewRecorder()

		ctrl.ValidateTicket(rec, req.WithContext(ctx))

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK on ValidateTicket, got %d", rec.Code)
		}
	})

	t.Run("AnnulTicket Handler Success", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/v1/tickets/t-123/annul", bytes.NewBufferString(`{"reason":"refund"}`))
		req.SetPathValue("id", "t-123")
		user := &models.User{ID: "operator-1", Role: models.RoleSeller, Status: models.StatusActive}
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, user)
		rec := httptest.NewRecorder()

		ctrl.AnnulTicket(rec, req.WithContext(ctx))

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK on AnnulTicket, got %d", rec.Code)
		}
	})

	t.Run("GetPrices Handler", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/tickets/prices", nil)
		rec := httptest.NewRecorder()

		ctrl.GetPrices(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetPrices, got %d", rec.Code)
		}
	})

	t.Run("UpdatePrice Handler", func(t *testing.T) {
		upReq := dto.UpdateTicketPriceRequest{
			TicketType: models.TicketTypeSimple,
			Price:      1200.0,
		}
		body, _ := json.Marshal(upReq)

		admin := &models.User{ID: "admin-1", Role: models.RoleAdmin, Status: models.StatusActive}
		req := httptest.NewRequest(http.MethodPut, "/api/v1/tickets/prices", bytes.NewReader(body))
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, admin)
		rec := httptest.NewRecorder()

		ctrl.UpdatePrice(rec, req.WithContext(ctx))

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdatePrice, got %d", rec.Code)
		}
	})
}

func TestQuotaController_Handlers(t *testing.T) {
	jsonView := views.NewJSONView()
	mockQuotaSvc := &MockQuotaService{
		SellerSummary: &dto.SellerQuotaSummaryResponse{SellerID: "s-1", AssignedQuota: 10, AvailableQuota: 5},
		GlobalSummary: &dto.GlobalFreeQuotaResponse{TotalFreeQuota: 100, AvailableQuota: 80},
		DefaultCfg:    &dto.DefaultQuotaConfigResponse{DefaultPersonalQuota: 20},
		Overview:      &dto.AdminQuotaOverviewResponse{DefaultPersonalQuota: 20},
	}
	ctrl := controllers.NewQuotaController(mockQuotaSvc, jsonView)

	t.Run("GetSellerQuota Missing ID -> 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/seller/", nil)
		rec := httptest.NewRecorder()

		ctrl.GetSellerQuota(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400, got %d", rec.Code)
		}
	})

	t.Run("GetSellerQuota Success", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/seller/s-1", nil)
		req.SetPathValue("id", "s-1")
		rec := httptest.NewRecorder()

		ctrl.GetSellerQuota(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetSellerQuota, got %d", rec.Code)
		}
	})

	t.Run("GetGlobalFreeQuota", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/free", nil)
		rec := httptest.NewRecorder()

		ctrl.GetGlobalFreeQuota(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetGlobalFreeQuota, got %d", rec.Code)
		}
	})

	t.Run("GetDefaultQuotaConfig", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/config/default", nil)
		rec := httptest.NewRecorder()

		ctrl.GetDefaultQuotaConfig(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetDefaultQuotaConfig, got %d", rec.Code)
		}
	})

	t.Run("GetAdminQuotaOverview", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/overview", nil)
		rec := httptest.NewRecorder()

		ctrl.GetAdminQuotaOverview(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetAdminQuotaOverview, got %d", rec.Code)
		}
	})

	t.Run("GetExhaustedSellers", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/quotas/exhausted", nil)
		rec := httptest.NewRecorder()

		ctrl.GetExhaustedSellers(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for GetExhaustedSellers, got %d", rec.Code)
		}
	})

	t.Run("UpdateQuota Personal", func(t *testing.T) {
		sellerID := "s-1"
		upReq := dto.UpdateQuotaRequest{
			QuotaType:     models.QuotaTypePersonal,
			SellerID:      &sellerID,
			AssignedQuota: 30,
		}
		body, _ := json.Marshal(upReq)

		req := httptest.NewRequest(http.MethodPut, "/api/v1/quotas", bytes.NewReader(body))
		req.Header.Set("X-User-ID", "admin-1")
		rec := httptest.NewRecorder()

		ctrl.UpdateQuota(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdateQuota, got %d", rec.Code)
		}
	})

	t.Run("UpdateQuota Free", func(t *testing.T) {
		upReq := dto.UpdateQuotaRequest{
			QuotaType:     models.QuotaTypeFree,
			AssignedQuota: 500,
		}
		body, _ := json.Marshal(upReq)

		req := httptest.NewRequest(http.MethodPut, "/api/v1/quotas", bytes.NewReader(body))
		req.Header.Set("X-User-ID", "admin-1")
		rec := httptest.NewRecorder()

		ctrl.UpdateQuota(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdateQuota Free, got %d", rec.Code)
		}
	})

	t.Run("UpdateDefaultQuotaConfig", func(t *testing.T) {
		upReq := dto.UpdateDefaultQuotaRequest{
			DefaultPersonalQuota: 40,
		}
		body, _ := json.Marshal(upReq)

		req := httptest.NewRequest(http.MethodPut, "/api/v1/quotas/config/default", bytes.NewReader(body))
		req.Header.Set("X-User-ID", "admin-1")
		rec := httptest.NewRecorder()

		ctrl.UpdateDefaultQuotaConfig(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for UpdateDefaultQuotaConfig, got %d", rec.Code)
		}
	})
}
