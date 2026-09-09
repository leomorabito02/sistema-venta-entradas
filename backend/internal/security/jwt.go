package security

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"
	"time"

	"backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	UserID string          `json:"user_id"`
	Email  string          `json:"email"`
	Role   models.UserRole `json:"role"`
	jwt.RegisteredClaims
}

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "fallback_dev_jwt_secret_key_change_in_production"
	}
	return []byte(secret)
}

func getAccessTokenDuration() time.Duration {
	expStr := os.Getenv("JWT_ACCESS_EXPIRATION_MINUTES")
	if minutes, err := strconv.Atoi(expStr); err == nil && minutes > 0 {
		return time.Duration(minutes) * time.Minute
	}
	return 15 * time.Minute
}

// GenerateAccessToken signs a short-lived JWT Access Token (OWASP requirement).
func GenerateAccessToken(user *models.User) (string, int64, error) {
	duration := getAccessTokenDuration()
	expiresAt := time.Now().Add(duration)

	claims := &JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   user.ID,
			Issuer:    "sistema-venta-entradas-backend",
			Audience:  jwt.ClaimStrings{"sistema-venta-entradas-app"},
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(getJWTSecret())
	if err != nil {
		return "", 0, fmt.Errorf("failed to sign access token: %w", err)
	}

	return tokenString, int64(duration.Seconds()), nil
}

// ValidateAccessToken verifies and parses a JWT Access Token.
func ValidateAccessToken(tokenStr string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return getJWTSecret(), nil
	})

	if err != nil || token == nil || !token.Valid {
		return nil, fmt.Errorf("invalid or expired token: %w", err)
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}

// GenerateRefreshToken creates a 256-bit cryptographically secure random token.
func GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}
	return hex.EncodeToString(b), nil
}

// HashToken computes a SHA-256 digest of a token string (OWASP requirement: plain-text tokens are never stored in DB).
func HashToken(tokenStr string) string {
	hash := sha256.Sum256([]byte(tokenStr))
	return hex.EncodeToString(hash[:])
}
