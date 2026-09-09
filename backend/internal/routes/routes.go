package routes

import (
	"net/http"
	"os"
	"strings"

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

	// 1. Unprotected Public Routes
	mux.HandleFunc("GET /health", cfg.HealthController.Health)
	if cfg.TicketController != nil {
		mux.HandleFunc("GET /api/tickets/public/{token}", cfg.TicketController.GetPublicTicket)
	}
	if cfg.AuthController != nil {
		mux.HandleFunc("POST /api/auth/google", cfg.AuthController.GoogleLogin)
		mux.HandleFunc("POST /api/auth/refresh", cfg.AuthController.Refresh)
		mux.HandleFunc("POST /api/auth/logout", cfg.AuthController.Logout)
	}

	// 2. Protected Routes (require Valid JWT / Firebase Auth & ACTIVE status)
	if cfg.UserRepo != nil {
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
		}

		if cfg.AuthController != nil {
			mux.Handle("GET /api/users", authMW(adminMW(http.HandlerFunc(cfg.AuthController.ListUsers))))
			mux.Handle("PUT /api/users/{id}/status", authMW(adminMW(http.HandlerFunc(cfg.AuthController.UpdateUserStatus))))
			mux.Handle("PUT /api/users/{id}/role", authMW(adminMW(http.HandlerFunc(cfg.AuthController.UpdateUserRole))))
		}
	}

	// Global Security, CORS & Recovery Middlewares
	var handler http.Handler = mux
	handler = middlewares.MaxBodySize(1<<20, cfg.JSONView)(handler) // 1MB payload limit
	handler = middlewares.SecurityHeaders(handler)

	allowedOrigins := []string{"http://localhost:4200", "http://localhost:3000", "http://127.0.0.1:4200"}
	if envOrigin := os.Getenv("ALLOWED_ORIGINS"); envOrigin != "" {
		allowedOrigins = strings.Split(envOrigin, ",")
	}
	handler = middlewares.CORS(allowedOrigins)(handler)
	handler = middlewares.ValidateAntiCSRF(cfg.JSONView)(handler)
	handler = middlewares.Recovery(cfg.JSONView)(handler)

	return handler
}

