package main

import (
	"log"
	"os"

	"backend/internal/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../.env")
	_ = godotenv.Load("../../.env")

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatalf("Error: DATABASE_URL environment variable is not set.")
	}

	log.Println("Connecting to PostgreSQL database for migration...")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Ensure pgcrypto extension is active for gen_random_uuid()
	_ = db.Exec(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`).Error

	log.Println("Running AutoMigrate for models...")
	err = db.AutoMigrate(
		&models.User{},
		&models.RefreshToken{},
		&models.SellerQuota{},
		&models.GlobalFreeQuota{},
		&models.DefaultQuotaConfig{},
		&models.QuotaAuditLog{},
		&models.TicketPrice{},
		&models.Buyer{},
		&models.Ticket{},
		&models.TicketValidation{},
	)
	if err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}

	// Ensure quota_source in tickets table is NOT NULL and existing NULL values are updated
	_ = db.Exec(`UPDATE tickets SET quota_source = 'LIBRE' WHERE quota_source IS NULL OR quota_source = '';`).Error
	_ = db.Exec(`ALTER TABLE tickets ALTER COLUMN quota_source SET NOT NULL;`).Error

	// Create partial unique index on 4-digit codes for active tickets (RNF-06.02)
	rawIndexSQL := `
		CREATE UNIQUE INDEX IF NOT EXISTS idx_active_tickets_4digit_code 
		ON tickets(four_digit_code) 
		WHERE status IN ('VENDIDO', 'USADO_ENTRADA');
	`
	if err := db.Exec(rawIndexSQL).Error; err != nil {
		log.Printf("Warning: Failed to ensure partial index: %v", err)
	}

	log.Println("Database schema migration completed successfully.")
}
