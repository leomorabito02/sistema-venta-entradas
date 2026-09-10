package services_test

import (
	"context"
	"testing"
	"time"

	"backend/internal/models"
	"backend/internal/security"
	"backend/internal/services"
)

func setupAuthServiceTest() (services.AuthService, *MockUserRepository, *MockTokenRepository) {
	userRepo := NewMockUserRepository()
	tokenRepo := NewMockTokenRepository()

	user := &models.User{
		ID:     "user-uuid-1",
		Email:  "user1@example.com",
		Name:   "User One",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	userRepo.Users[user.ID] = user

	svc := services.NewAuthService(userRepo, tokenRepo)
	return svc, userRepo, tokenRepo
}

func TestAuthService_GetUserByID(t *testing.T) {
	svc, _, _ := setupAuthServiceTest()
	ctx := context.Background()

	// Empty ID
	_, err := svc.GetUserByID(ctx, "")
	if err == nil {
		t.Errorf("Expected error for empty user ID")
	}

	// Valid user ID
	u, err := svc.GetUserByID(ctx, "user-uuid-1")
	if err != nil {
		t.Fatalf("GetUserByID failed: %v", err)
	}
	if u.Email != "user1@example.com" {
		t.Errorf("Expected email user1@example.com, got %s", u.Email)
	}

	// Non-existent user ID
	_, err = svc.GetUserByID(ctx, "unknown-uuid")
	if err == nil {
		t.Errorf("Expected error for non-existent user ID")
	}
}

func TestAuthService_AuthenticateGoogleUser(t *testing.T) {
	svc, userRepo, _ := setupAuthServiceTest()
	ctx := context.Background()

	// Missing args
	_, err := svc.AuthenticateGoogleUser(ctx, "", "Name", "g-123")
	if err == nil {
		t.Errorf("Expected error when email is missing")
	}

	// New Google User (will be PENDING)
	t.Setenv("JWT_SECRET", "test-secret-key-32-chars-long!!")
	resp, err := svc.AuthenticateGoogleUser(ctx, "newgoogle@example.com", "Google User", "g-123")
	if err != nil {
		t.Fatalf("AuthenticateGoogleUser failed: %v", err)
	}
	if resp.Status != models.StatusPending {
		t.Errorf("Expected StatusPending for new user, got %s", resp.Status)
	}

	// Existing ACTIVE user
	activeUser := &models.User{
		ID:     "active-google-id",
		Email:  "activeg@example.com",
		Name:   "Active G",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	userRepo.Users[activeUser.ID] = activeUser

	respActive, err := svc.AuthenticateGoogleUser(ctx, "activeg@example.com", "Active G", "g-456")
	if err != nil {
		t.Fatalf("AuthenticateGoogleUser active failed: %v", err)
	}
	if respActive.AccessToken == "" {
		t.Errorf("Expected non-empty AccessToken for active user")
	}

	// DISABLED user
	disabledUser := &models.User{
		ID:     "disabled-google-id",
		Email:  "disabled@example.com",
		Name:   "Disabled G",
		Role:   models.RoleSeller,
		Status: models.StatusDisabled,
	}
	userRepo.Users[disabledUser.ID] = disabledUser

	_, err = svc.AuthenticateGoogleUser(ctx, "disabled@example.com", "Disabled G", "g-789")
	if err == nil {
		t.Errorf("Expected error for DISABLED user")
	}
}

func TestAuthService_RotateRefreshToken(t *testing.T) {
	svc, _, tokenRepo := setupAuthServiceTest()
	ctx := context.Background()
	t.Setenv("JWT_SECRET", "test-secret-key-32-chars-long!!")

	// 1. Missing refresh token
	_, err := svc.RotateRefreshToken(ctx, "")
	if err == nil {
		t.Errorf("Expected error for empty refresh token")
	}

	// 2. Non-existent refresh token
	_, err = svc.RotateRefreshToken(ctx, "raw-token-123")
	if err == nil {
		t.Errorf("Expected error for un-stored refresh token")
	}

	// 3. Valid active refresh token
	rawToken := "valid-raw-refresh-token-32-bytes"
	tokenHash := security.HashToken(rawToken)
	tokenRepo.Tokens[tokenHash] = &models.RefreshToken{
		ID:        "token-id-1",
		UserID:    "user-uuid-1",
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(time.Hour * 24),
		RevokedAt: nil,
	}

	resp, err := svc.RotateRefreshToken(ctx, rawToken)
	if err != nil {
		t.Fatalf("RotateRefreshToken failed: %v", err)
	}
	if resp.AccessToken == "" {
		t.Errorf("Expected new AccessToken upon rotation")
	}

	// Old token must be marked revoked
	oldToken := tokenRepo.Tokens[tokenHash]
	if oldToken.RevokedAt == nil {
		t.Errorf("Expected old refresh token to be marked revoked after rotation")
	}

	// 4. Token Reuse Detection (attempt to rotate revoked token)
	_, err = svc.RotateRefreshToken(ctx, rawToken)
	if err == nil {
		t.Errorf("Expected error when attempting to reuse revoked refresh token")
	}
}

func TestAuthService_LogoutAndUserManagement(t *testing.T) {
	svc, userRepo, tokenRepo := setupAuthServiceTest()
	ctx := context.Background()

	// Logout
	rawToken := "logout-raw-token"
	tokenHash := security.HashToken(rawToken)
	tokenRepo.Tokens[tokenHash] = &models.RefreshToken{
		ID:        "token-id-2",
		UserID:    "user-uuid-1",
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(time.Hour),
		RevokedAt: nil,
	}

	err := svc.Logout(ctx, rawToken)
	if err != nil {
		t.Fatalf("Logout failed: %v", err)
	}
	if tokenRepo.Tokens[tokenHash].RevokedAt == nil {
		t.Errorf("Expected token to be revoked on logout")
	}

	// ListUsers
	users, err := svc.ListUsers(ctx)
	if err != nil || len(users) == 0 {
		t.Fatalf("ListUsers failed: %v", err)
	}

	// UpdateUserStatus
	err = svc.UpdateUserStatus(ctx, "user-uuid-1", models.StatusDisabled)
	if err != nil {
		t.Fatalf("UpdateUserStatus failed: %v", err)
	}
	if userRepo.Users["user-uuid-1"].Status != models.StatusDisabled {
		t.Errorf("Expected StatusDisabled, got %s", userRepo.Users["user-uuid-1"].Status)
	}

	// UpdateUserRole
	err = svc.UpdateUserRole(ctx, "user-uuid-1", models.RoleAdmin)
	if err != nil {
		t.Fatalf("UpdateUserRole failed: %v", err)
	}
	if userRepo.Users["user-uuid-1"].Role != models.RoleAdmin {
		t.Errorf("Expected RoleAdmin, got %s", userRepo.Users["user-uuid-1"].Role)
	}
}
