package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/security"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../.env")

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL env var is required")
	}

	db, err := database.ConnectDB(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	userRepo := repository.NewUserRepository(db)
	users, err := userRepo.List(context.Background())
	if err != nil || len(users) == 0 {
		log.Fatalf("Failed to fetch users or no users found in DB: %v", err)
	}

	var targetUser *models.User
	for _, u := range users {
		if u.Status == models.StatusActive {
			targetUser = u
			break
		}
	}

	if targetUser == nil {
		log.Fatal("No active user found in DB")
	}

	tokenStr, _, err := security.GenerateAccessToken(targetUser)
	if err != nil {
		log.Fatalf("Failed to generate access token: %v", err)
	}

	fmt.Println(tokenStr)
}
