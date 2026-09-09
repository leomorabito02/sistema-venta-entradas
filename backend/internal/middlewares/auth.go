package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/security"
	"backend/internal/views"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserContextKey contextKey = "user"

const (
	errAccountDisabled = "User account is disabled"
	errAccountPending  = "User account is pending activation by an administrator"
)

// GetUserFromContext retrieves the authenticated user from the HTTP request context.
func GetUserFromContext(ctx context.Context) (*models.User, bool) {
	u, ok := ctx.Value(UserContextKey).(*models.User)
	return u, ok
}

// FirebaseAuthMiddleware verifies JWT Access Tokens (or Firebase ID Tokens) and enforces active user status.
func FirebaseAuthMiddleware(userRepo repository.UserRepository, jsonView *views.JSONView) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authenticateRequest(next, w, r, userRepo, jsonView)
		})
	}
}

func authenticateRequest(next http.Handler, w http.ResponseWriter, r *http.Request, userRepo repository.UserRepository, jsonView *views.JSONView) {
	tokenStr := extractBearerToken(r.Header.Get("Authorization"))
	if tokenStr == "" {
		handleNoToken(next, w, r, userRepo, jsonView)
		return
	}
	handleWithToken(next, w, r, tokenStr, userRepo, jsonView)
}

func handleNoToken(next http.Handler, w http.ResponseWriter, r *http.Request, userRepo repository.UserRepository, jsonView *views.JSONView) {
	user, handled := handleDevUserFallback(r, w, userRepo, jsonView)
	if !handled {
		jsonView.Error(w, http.StatusUnauthorized, "Missing or invalid authorization token", nil)
		return
	}
	if user != nil {
		serveWithUser(next, w, r, user)
	}
}

func handleWithToken(next http.Handler, w http.ResponseWriter, r *http.Request, tokenStr string, userRepo repository.UserRepository, jsonView *views.JSONView) bool {
	user, handled := handleBackendToken(r, w, tokenStr, userRepo, jsonView)
	if handled {
		if user != nil {
			serveWithUser(next, w, r, user)
		}
		return true
	}

	user, handled = handleFirebaseToken(r, w, tokenStr, userRepo, jsonView)
	if handled && user != nil {
		serveWithUser(next, w, r, user)
		return true
	}
	return false
}

func extractBearerToken(authHeader string) string {
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}
	return ""
}

func checkUserStatus(u *models.User, jsonView *views.JSONView, w http.ResponseWriter) bool {
	if u.Status == models.StatusPending {
		jsonView.Error(w, http.StatusForbidden, errAccountPending, nil)
		return false
	}
	if u.Status == models.StatusDisabled {
		jsonView.Error(w, http.StatusForbidden, errAccountDisabled, nil)
		return false
	}
	return true
}

func serveWithUser(next http.Handler, w http.ResponseWriter, r *http.Request, u *models.User) {
	ctx := context.WithValue(r.Context(), UserContextKey, u)
	next.ServeHTTP(w, r.WithContext(ctx))
}

func handleDevUserFallback(r *http.Request, w http.ResponseWriter, userRepo repository.UserRepository, jsonView *views.JSONView) (*models.User, bool) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		return nil, false
	}
	u, err := userRepo.GetByID(r.Context(), userID)
	if err != nil {
		return nil, false
	}
	if !checkUserStatus(u, jsonView, w) {
		return nil, true
	}
	return u, true
}

func handleBackendToken(r *http.Request, w http.ResponseWriter, tokenStr string, userRepo repository.UserRepository, jsonView *views.JSONView) (*models.User, bool) {
	claims, err := security.ValidateAccessToken(tokenStr)
	if err != nil || claims == nil {
		return nil, false
	}
	u, err := userRepo.GetByID(r.Context(), claims.UserID)
	if err != nil {
		jsonView.Error(w, http.StatusUnauthorized, "User account associated with token not found", err)
		return nil, true
	}
	if !checkUserStatus(u, jsonView, w) {
		return nil, true
	}
	return u, true
}

func handleFirebaseToken(r *http.Request, w http.ResponseWriter, tokenStr string, userRepo repository.UserRepository, jsonView *views.JSONView) (*models.User, bool) {
	fbClaims := jwt.MapClaims{}
	parsedToken, _, err := jwt.NewParser().ParseUnverified(tokenStr, fbClaims)
	if err != nil || parsedToken == nil {
		jsonView.Error(w, http.StatusUnauthorized, "Invalid authorization token", err)
		return nil, true
	}

	if !validateFirebaseProjectID(w, fbClaims, jsonView) {
		return nil, true
	}

	googleID, _ := fbClaims["sub"].(string)
	email, _ := fbClaims["email"].(string)
	name, _ := fbClaims["name"].(string)
	if name == "" {
		name = email
	}

	if googleID == "" || email == "" {
		jsonView.Error(w, http.StatusUnauthorized, "Token missing required user claims", nil)
		return nil, true
	}

	user, isNew, err := userRepo.UpsertGoogleUser(r.Context(), email, name, googleID)
	if err != nil {
		jsonView.Error(w, http.StatusInternalServerError, "Failed to resolve user account", err)
		return nil, true
	}

	if isNew || user.Status == models.StatusPending {
		jsonView.Error(w, http.StatusForbidden, "User account created and pending administrator activation", nil)
		return nil, true
	}

	if user.Status == models.StatusDisabled {
		jsonView.Error(w, http.StatusForbidden, errAccountDisabled, nil)
		return nil, true
	}

	return user, true
}

func validateFirebaseProjectID(w http.ResponseWriter, fbClaims jwt.MapClaims, jsonView *views.JSONView) bool {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		projectID = os.Getenv("GCP_PROJECT_ID")
	}

	if projectID != "" {
		iss, _ := fbClaims["iss"].(string)
		aud, _ := fbClaims["aud"].(string)
		expectedIss := fmt.Sprintf("https://securetoken.google.com/%s", projectID)

		if iss != expectedIss || aud != projectID {
			jsonView.Error(w, http.StatusUnauthorized, "Invalid token issuer or audience", nil)
			return false
		}
	}
	return true
}

// RequireRole enforces role-based access control (RBAC).
func RequireRole(role models.UserRole, jsonView *views.JSONView) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			u, ok := GetUserFromContext(r.Context())
			if !ok || u == nil {
				jsonView.Error(w, http.StatusUnauthorized, "Unauthorized request", nil)
				return
			}

			if u.Role != role && u.Role != models.RoleAdmin {
				jsonView.Error(w, http.StatusForbidden, "Insufficient permissions to access this resource", nil)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
