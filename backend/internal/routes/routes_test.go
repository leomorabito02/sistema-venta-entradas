package routes

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"backend/internal/controllers"
	"backend/internal/models"
	"backend/internal/views"
)

func TestSetupRoutes_PublicEndpoints(t *testing.T) {
	view := views.NewJSONView()
	healthCtrl := controllers.NewHealthController(view)

	cfg := RouterConfig{
		HealthController: healthCtrl,
		JSONView:         view,
	}

	handler := SetupRoutes(cfg)

	// Test GET /health
	req := httptest.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected GET /health status 200, got %d", w.Code)
	}
}

func TestSetupRoutes_PublicTicketRateLimit(t *testing.T) {
	view := views.NewJSONView()
	cfg := RouterConfig{
		JSONView: view,
	}
	handler := SetupRoutes(cfg)

	req := httptest.NewRequest("GET", "/api/tickets/public/nonexistent-token", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	// Controller is nil -> unavailable handler (503) wrapped by public rate limiter
	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503 Service Unavailable for nil ticket controller, got %d", w.Code)
	}
}

func TestSetupRoutes_AntiCSRF(t *testing.T) {
	view := views.NewJSONView()
	cfg := RouterConfig{
		JSONView: view,
	}
	handler := SetupRoutes(cfg)

	// POST request without X-Requested-With header -> 403 Forbidden by anti-CSRF middleware
	req := httptest.NewRequest("POST", "/api/auth/google", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Errorf("expected 403 Forbidden for state-changing request without X-Requested-With header, got %d", w.Code)
	}

	// POST request with X-Requested-With header -> proceeds past anti-CSRF
	req2 := httptest.NewRequest("POST", "/api/auth/google", nil)
	req2.Header.Set("X-Requested-With", "XMLHttpRequest")
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req2)

	if w2.Code == http.StatusForbidden {
		t.Errorf("expected request to pass anti-CSRF when X-Requested-With header is present")
	}
}

func TestSetupRoutes_CORS(t *testing.T) {
	view := views.NewJSONView()
	cfg := RouterConfig{
		JSONView: view,
	}
	handler := SetupRoutes(cfg)

	// OPTIONS preflight request
	req := httptest.NewRequest("OPTIONS", "/health", nil)
	req.Header.Set("Origin", "http://localhost:4200")
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("expected 204 No Content for OPTIONS preflight, got %d", w.Code)
	}
	if w.Header().Get("Access-Control-Allow-Origin") != "http://localhost:4200" {
		t.Errorf("expected Access-Control-Allow-Origin header to match allowed origin")
	}
}

func TestSetupRoutes_MaxBodySize(t *testing.T) {
	view := views.NewJSONView()
	cfg := RouterConfig{
		JSONView: view,
	}
	handler := SetupRoutes(cfg)

	// Request with payload larger than 1MB
	largePayload := bytes.Repeat([]byte("A"), (1<<20)+100)
	req := httptest.NewRequest("POST", "/api/auth/google", bytes.NewReader(largePayload))
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	w := httptest.NewRecorder()

	handler.ServeHTTP(w, req)

	// The MaxBodySize middleware restricts reading past 1MB
	if w.Code == http.StatusOK {
		t.Errorf("expected request with oversized payload to be rejected or fail reading body")
	}
}

func TestBuildAllowedOrigins_Environment(t *testing.T) {
	os.Setenv("ALLOWED_ORIGINS", "https://custom1.com, https://custom2.com")
	defer os.Unsetenv("ALLOWED_ORIGINS")

	origins := buildAllowedOrigins()

	foundCustom1 := false
	foundCustom2 := false
	for _, o := range origins {
		if o == "https://custom1.com" {
			foundCustom1 = true
		}
		if o == "https://custom2.com" {
			foundCustom2 = true
		}
	}

	if !foundCustom1 || !foundCustom2 {
		t.Errorf("expected custom origins to be appended from ALLOWED_ORIGINS env var")
	}
}

type dummyUserRepo struct{}

func (d *dummyUserRepo) Create(ctx context.Context, u *models.User) error { return nil }
func (d *dummyUserRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	return &models.User{ID: id, Role: models.RoleAdmin, Status: models.StatusActive}, nil
}
func (d *dummyUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	return nil, nil
}
func (d *dummyUserRepo) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	return nil, nil
}
func (d *dummyUserRepo) UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error) {
	return nil, false, nil
}
func (d *dummyUserRepo) Update(ctx context.Context, u *models.User) error { return nil }
func (d *dummyUserRepo) List(ctx context.Context) ([]*models.User, error) { return nil, nil }
func (d *dummyUserRepo) SeedInitialAdmin(ctx context.Context, email, name string) error { return nil }

func TestSetupRoutes_ProtectedRoutesRegistration(t *testing.T) {
	view := views.NewJSONView()
	healthCtrl := controllers.NewHealthController(view)
	authCtrl := controllers.NewAuthController(nil, view)
	ticketCtrl := controllers.NewTicketController(nil, view)
	quotaCtrl := controllers.NewQuotaController(nil, view)

	cfg := RouterConfig{
		UserRepo:         &dummyUserRepo{},
		HealthController: healthCtrl,
		AuthController:   authCtrl,
		TicketController: ticketCtrl,
		QuotaController:  quotaCtrl,
		JSONView:         view,
	}

	handler := SetupRoutes(cfg)
	if handler == nil {
		t.Fatal("expected handler to be created, got nil")
	}
}
