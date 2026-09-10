package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"backend/internal/controllers"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/routes"
	"backend/internal/services"
	"backend/internal/views"

	"github.com/joho/godotenv"
)

type dbRepos struct {
	userRepo   repository.UserRepository
	quotaRepo  repository.QuotaRepository
	ticketRepo repository.TicketRepository
	priceRepo  repository.PriceRepository
	tokenRepo  repository.TokenRepository
}

func initDatabase(dsn string) (dbRepos, func()) {
	if dsn == "" {
		log.Println("Warning: DATABASE_URL not set. Running server without database backend.")
		return dbRepos{}, func() { /* No database connection established; cleanup is no-op */ }
	}

	db, err := database.ConnectDB(dsn)
	if err != nil {
		log.Printf("Warning: Database connection failed: %v", err)
		return dbRepos{}, func() { /* No database connection established; cleanup is no-op */ }
	}

	log.Println("Connected to PostgreSQL database successfully")
	r := dbRepos{
		userRepo:   repository.NewUserRepository(db),
		quotaRepo:  repository.NewQuotaRepository(db),
		ticketRepo: repository.NewTicketRepository(db),
		priceRepo:  repository.NewPriceRepository(db),
		tokenRepo:  repository.NewTokenRepository(db),
	}

	adminEmail := os.Getenv("INITIAL_ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = "admin@sistema.com"
	}
	adminEmail = strings.ReplaceAll(strings.ReplaceAll(adminEmail, "\n", ""), "\r", "")

	if err := r.userRepo.SeedInitialAdmin(context.Background(), adminEmail, "Administrator"); err != nil {
		log.Printf("Warning: Failed to seed initial admin user: %v", err)
	} else {
		/* #nosec G706 */
		log.Printf("Initial admin user initialized (%s)", adminEmail)
	}

	return r, func() {
		if err := db.Close(); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}
}

func main() {
	// Configure UTC-3 (America/Argentina/Buenos_Aires) timezone for the application
	loc, err := time.LoadLocation("America/Argentina/Buenos_Aires")
	if err != nil {
		loc = time.FixedZone("ART", -3*3600)
	}
	time.Local = loc

	// Attempt to load .env file from current directory, parent, or backend root
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../.env")
	_ = godotenv.Load("../../.env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	port = strings.ReplaceAll(strings.ReplaceAll(port, "\n", ""), "\r", "")

	dsn := os.Getenv("DATABASE_URL")
	jsonView := views.NewJSONView()

	r, cleanup := initDatabase(dsn)
	defer cleanup()

	healthController := controllers.NewHealthController(jsonView)

	var authController *controllers.AuthController
	var quotaController *controllers.QuotaController
	var ticketController *controllers.TicketController

	if r.userRepo != nil && r.quotaRepo != nil && r.ticketRepo != nil && r.priceRepo != nil && r.tokenRepo != nil {
		authService := services.NewAuthService(r.userRepo, r.tokenRepo)
		quotaService := services.NewQuotaService(r.quotaRepo, r.userRepo)
		ticketService := services.NewTicketService(r.ticketRepo, r.quotaRepo, r.priceRepo, r.userRepo)

		authController = controllers.NewAuthController(authService, jsonView)
		quotaController = controllers.NewQuotaController(quotaService, jsonView)
		ticketController = controllers.NewTicketController(ticketService, jsonView)
	}

	handler := routes.SetupRoutes(routes.RouterConfig{
		UserRepo:         r.userRepo,
		HealthController: healthController,
		AuthController:   authController,
		QuotaController:  quotaController,
		TicketController: ticketController,
		JSONView:         jsonView,
	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		/* #nosec G706 */
		log.Printf("Server listening on port %s", port)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	<-shutdownChan
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped cleanly")
}
