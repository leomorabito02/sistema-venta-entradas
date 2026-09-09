package security_test

import (
	"testing"

	"backend/internal/models"
	"backend/internal/security"
)

func TestGenerateAndValidateAccessToken(t *testing.T) {
	user := &models.User{
		ID:    "11111111-1111-1111-1111-111111111111",
		Email: "test@example.com",
		Role:  models.RoleSeller,
	}

	tokenStr, expiresIn, err := security.GenerateAccessToken(user)
	if err != nil {
		t.Fatalf("GenerateAccessToken failed: %v", err)
	}

	if tokenStr == "" {
		t.Errorf("Expected non-empty access token string")
	}

	if expiresIn <= 0 {
		t.Errorf("Expected positive expiresIn duration")
	}

	claims, err := security.ValidateAccessToken(tokenStr)
	if err != nil {
		t.Fatalf("ValidateAccessToken failed: %v", err)
	}

	if claims.UserID != user.ID {
		t.Errorf("Expected UserID %s, got %s", user.ID, claims.UserID)
	}

	if claims.Email != user.Email {
		t.Errorf("Expected Email %s, got %s", user.Email, claims.Email)
	}

	if claims.Role != user.Role {
		t.Errorf("Expected Role %s, got %s", user.Role, claims.Role)
	}
}

func TestGenerateAndHashRefreshToken(t *testing.T) {
	rawToken, err := security.GenerateRefreshToken()
	if err != nil {
		t.Fatalf("GenerateRefreshToken failed: %v", err)
	}

	if len(rawToken) != 64 { // 32 bytes hex encoded
		t.Errorf("Expected 64 hex char refresh token, got len %d", len(rawToken))
	}

	hash1 := security.HashToken(rawToken)
	hash2 := security.HashToken(rawToken)

	if hash1 != hash2 {
		t.Errorf("Hash mismatch for same token input")
	}

	if len(hash1) != 64 { // SHA-256 hex encoded
		t.Errorf("Expected 64 char SHA-256 digest, got len %d", len(hash1))
	}
}
