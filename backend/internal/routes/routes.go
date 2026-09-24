package routes

import (
	"net/http"
	"os"
	"strings"
	"time"

	"backend/internal/controllers"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/views"
)

type RouterConfig struct {
	UserRepo         repository.UserRepository
	HealthController *controllers.HealthController
	AuthController   *controllers.AuthController
	QuotaController  *controllers.QuotaController
	TicketController *controllers.TicketController
	JSONView         *views.JSONView
}

// SetupRoutes registers all public and protected HTTP routes with middleware chains.
func SetupRoutes(cfg RouterConfig) http.Handler {
	mux := http.NewServeMux()

	unavailableHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cfg.JSONView.Error(w, http.StatusServiceUnavailable, "Database or auth service unavailable", nil)
	})

	registerPublicRoutes(mux, cfg, unavailableHandler)
	registerProtectedRoutes(mux, cfg)

	// Global Security, CORS & Recovery Middlewares
	var handler http.Handler = mux
	handler = middlewares.MaxBodySize(1<<20, cfg.JSONView)(handler) // 1MB payload limit
	handler = middlewares.SecurityHeaders(handler)
	handler = middlewares.CORS(buildAllowedOrigins())(handler)
	handler = middlewares.ValidateAntiCSRF(cfg.JSONView)(handler)
	handler = middlewares.Recovery(cfg.JSONView)(handler)
	handler = middlewares.RequestLogger(handler)

	return handler
}

func registerPublicRoutes(mux *http.ServeMux, cfg RouterConfig, unavailableHandler http.Handler) {
	mux.HandleFunc("GET /health", cfg.HealthController.Health)

	publicLimiter := middlewares.PublicTicketRateLimiter(1*time.Minute, 10, 1*time.Minute, cfg.JSONView)

	if cfg.TicketController != nil {
		mux.Handle("GET /api/tickets/public/{token}", publicLimiter(http.HandlerFunc(cfg.TicketController.GetPublicTicket)))
	} else {
		mux.Handle("GET /api/tickets/public/{token}", publicLimiter(unavailableHandler))
	}

	if cfg.AuthController != nil {
		mux.HandleFunc("POST /api/auth/google", cfg.AuthController.GoogleLogin)
		mux.HandleFunc("POST /api/auth/refresh", cfg.AuthController.Refresh)
		mux.HandleFunc("POST /api/auth/logout", cfg.AuthController.Logout)
	} else {
		mux.Handle("POST /api/auth/google", unavailableHandler)
		mux.Handle("POST /api/auth/refresh", unavailableHandler)
		mux.Handle("POST /api/auth/logout", unavailableHandler)
	}
}

func registerProtectedRoutes(mux *http.ServeMux, cfg RouterConfig) {
	if cfg.UserRepo == nil {
		return
	}

	authMW := middlewares.FirebaseAuthMiddleware(cfg.UserRepo, cfg.JSONView)
	adminMW := middlewares.RequireRole(models.RoleAdmin, cfg.JSONView)

	if cfg.TicketController != nil {
		mux.Handle("GET /api/tickets", authMW(http.HandlerFunc(cfg.TicketController.ListTickets)))
		mux.Handle("POST /api/tickets", authMW(http.HandlerFunc(cfg.TicketController.CreateTicket)))
		mux.Handle("POST /api/tickets/validate", authMW(http.HandlerFunc(cfg.TicketController.ValidateTicket)))
		mux.Handle("POST /api/tickets/{id}/annul", authMW(http.HandlerFunc(cfg.TicketController.AnnulTicket)))
		mux.Handle("GET /api/prices", authMW(http.HandlerFunc(cfg.TicketController.GetPrices)))
		mux.Handle("PUT /api/prices", authMW(adminMW(http.HandlerFunc(cfg.TicketController.UpdatePrice))))
	}

	if cfg.QuotaController != nil {
		mux.Handle("GET /api/quotas/seller/{id}", authMW(http.HandlerFunc(cfg.QuotaController.GetSellerQuota)))
		mux.Handle("GET /api/quotas/free", authMW(http.HandlerFunc(cfg.QuotaController.GetGlobalFreeQuota)))
		mux.Handle("PUT /api/quotas", authMW(adminMW(http.HandlerFunc(cfg.QuotaController.UpdateQuota))))
		mux.Handle("GET /api/admin/quotas/overview", authMW(adminMW(http.HandlerFunc(cfg.QuotaController.GetAdminQuotaOverview))))
		mux.Handle("GET /api/admin/quotas/config", authMW(adminMW(http.HandlerFunc(cfg.QuotaController.GetDefaultQuotaConfig))))
		mux.Handle("PUT /api/admin/quotas/config", authMW(adminMW(http.HandlerFunc(cfg.QuotaController.UpdateDefaultQuotaConfig))))
		mux.Handle("GET /api/admin/quotas/exhausted", authMW(adminMW(http.HandlerFunc(cfg.QuotaController.GetExhaustedSellers))))
	}

	if cfg.AuthController != nil {
		mux.Handle("GET /api/users", authMW(adminMW(http.HandlerFunc(cfg.AuthController.ListUsers))))
		mux.Handle("PUT /api/users/{id}/status", authMW(adminMW(http.HandlerFunc(cfg.AuthController.UpdateUserStatus))))
		mux.Handle("PUT /api/users/{id}/role", authMW(adminMW(http.HandlerFunc(cfg.AuthController.UpdateUserRole))))
	}
}

func buildAllowedOrigins() []string {
	allowedOrigins := []string{
		"http://localhost:4200",
		"http://localhost:3000",
		"http://127.0.0.1:4200",
		"https://la-pena-semi-2026.pages.dev",
		".pages.dev",
	}
	envOrigin := os.Getenv("ALLOWED_ORIGINS")
	if envOrigin == "" {
		return allowedOrigins
	}

	for _, o := range strings.Split(envOrigin, ",") {
		if trimmed := strings.TrimSpace(o); trimmed != "" {
			allowedOrigins = append(allowedOrigins, trimmed)
		}
	}
	return allowedOrigins
}

