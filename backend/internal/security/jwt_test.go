package security_test

import (
	"testing"
	"time"

	"backend/internal/models"
	"backend/internal/security"

	"github.com/golang-jwt/jwt/v5"
)

const testSecret = "test-secret-key-32-chars-long!!"

func setupSecret(t *testing.T) {
	t.Helper()
	t.Setenv("JWT_SECRET", testSecret)
}

func TestGenerateAndValidateAccessToken(t *testing.T) {
	setupSecret(t)

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

func TestValidateAccessToken_InvalidTokens(t *testing.T) {
	setupSecret(t)

	tests := []struct {
		name     string
		tokenStr string
	}{
		{
			name:     "Empty token string",
			tokenStr: "",
		},
		{
			name:     "Malformed token string",
			tokenStr: "invalid.jwt.token",
		},
		{
			name:     "Token signed with different secret",
			tokenStr: generateTokenWithSecret(t, "wrong-secret-key"),
		},
		{
			name:     "Expired token",
			tokenStr: generateExpiredToken(t, testSecret),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			claims, err := security.ValidateAccessToken(tt.tokenStr)
			if err == nil {
				t.Errorf("Expected error for invalid token case %q, got nil claims: %v", tt.name, claims)
			}
		})
	}
}

func TestGenerateAccessToken_CustomExpiration(t *testing.T) {
	setupSecret(t)
	t.Setenv("JWT_ACCESS_EXPIRATION_MINUTES", "30")

	user := &models.User{
		ID:    "22222222-2222-2222-2222-222222222222",
		Email: "admin@example.com",
		Role:  models.RoleAdmin,
	}

	_, expiresIn, err := security.GenerateAccessToken(user)
	if err != nil {
		t.Fatalf("GenerateAccessToken failed: %v", err)
	}

	if expiresIn != 1800 {
		t.Errorf("Expected 1800 seconds (30 mins), got %d", expiresIn)
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

func generateTokenWithSecret(t *testing.T, secret string) string {
	t.Helper()
	claims := &security.JWTClaims{
		UserID: "user-id",
		Email:  "test@example.com",
		Role:   models.RoleSeller,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func generateExpiredToken(t *testing.T, secret string) string {
	t.Helper()
	claims := &security.JWTClaims{
		UserID: "user-id",
		Email:  "test@example.com",
		Role:   models.RoleSeller,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Minute * 15)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

