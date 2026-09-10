package middlewares_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/security"
	"backend/internal/views"
)

type MockUserRepoForAuth struct {
	Users map[string]*models.User
}

func (m *MockUserRepoForAuth) Create(ctx context.Context, user *models.User) error { return nil }
func (m *MockUserRepoForAuth) GetByID(ctx context.Context, id string) (*models.User, error) {
	u, ok := m.Users[id]
	if !ok {
		return nil, models.ErrNotFound
	}
	return u, nil
}
func (m *MockUserRepoForAuth) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, models.ErrNotFound
}
func (m *MockUserRepoForAuth) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	return nil, models.ErrNotFound
}
func (m *MockUserRepoForAuth) UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error) {
	return nil, false, nil
}
func (m *MockUserRepoForAuth) Update(ctx context.Context, user *models.User) error { return nil }
func (m *MockUserRepoForAuth) List(ctx context.Context) ([]*models.User, error)    { return nil, nil }
func (m *MockUserRepoForAuth) SeedInitialAdmin(ctx context.Context, email, name string) error {
	return nil
}

func TestFirebaseAuthMiddleware(t *testing.T) {
	t.Setenv("JWT_SECRET", "test-secret-key-32-chars-long!!")
	jsonView := views.NewJSONView()

	userRepo := &MockUserRepoForAuth{
		Users: map[string]*models.User{
			"active-user-id": {
				ID:     "active-user-id",
				Email:  "active@example.com",
				Role:   models.RoleSeller,
				Status: models.StatusActive,
			},
			"pending-user-id": {
				ID:     "pending-user-id",
				Email:  "pending@example.com",
				Role:   models.RoleSeller,
				Status: models.StatusPending,
			},
			"disabled-user-id": {
				ID:     "disabled-user-id",
				Email:  "disabled@example.com",
				Role:   models.RoleSeller,
				Status: models.StatusDisabled,
			},
		},
	}

	mw := middlewares.FirebaseAuthMiddleware(userRepo, jsonView)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, ok := middlewares.GetUserFromContext(r.Context())
		if !ok || u == nil {
			t.Errorf("Expected user in request context")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))

	t.Run("Missing Authorization Header -> 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/protected", nil)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401, got %d", rec.Code)
		}
	})

	t.Run("X-User-ID Fallback Header -> 200 OK", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/protected", nil)
		req.Header.Set("X-User-ID", "active-user-id")
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK for X-User-ID fallback, got %d", rec.Code)
		}
	})

	t.Run("Valid Access Token -> 200 OK", func(t *testing.T) {
		activeUser := userRepo.Users["active-user-id"]
		tokenStr, _, _ := security.GenerateAccessToken(activeUser)

		req := httptest.NewRequest(http.MethodGet, "/api/protected", nil)
		req.Header.Set("Authorization", "Bearer "+tokenStr)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK, got %d", rec.Code)
		}
	})

	t.Run("PENDING User -> 403 Forbidden", func(t *testing.T) {
		pendingUser := userRepo.Users["pending-user-id"]
		tokenStr, _, _ := security.GenerateAccessToken(pendingUser)

		req := httptest.NewRequest(http.MethodGet, "/api/protected", nil)
		req.Header.Set("Authorization", "Bearer "+tokenStr)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusForbidden {
			t.Errorf("Expected status 403 Forbidden for PENDING user, got %d", rec.Code)
		}
	})

	t.Run("DISABLED User -> 403 Forbidden", func(t *testing.T) {
		disabledUser := userRepo.Users["disabled-user-id"]
		tokenStr, _, _ := security.GenerateAccessToken(disabledUser)

		req := httptest.NewRequest(http.MethodGet, "/api/protected", nil)
		req.Header.Set("Authorization", "Bearer "+tokenStr)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusForbidden {
			t.Errorf("Expected status 403 Forbidden for DISABLED user, got %d", rec.Code)
		}
	})
}

func TestRequireRole(t *testing.T) {
	jsonView := views.NewJSONView()

	mw := middlewares.RequireRole(models.RoleAdmin, jsonView)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	t.Run("User with Admin role allowed -> 200 OK", func(t *testing.T) {
		adminUser := &models.User{ID: "admin-1", Role: models.RoleAdmin, Status: models.StatusActive}
		req := httptest.NewRequest(http.MethodGet, "/api/admin", nil)
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, adminUser)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req.WithContext(ctx))

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK, got %d", rec.Code)
		}
	})

	t.Run("User with Seller role forbidden -> 403 Forbidden", func(t *testing.T) {
		sellerUser := &models.User{ID: "seller-1", Role: models.RoleSeller, Status: models.StatusActive}
		req := httptest.NewRequest(http.MethodGet, "/api/admin", nil)
		ctx := context.WithValue(req.Context(), middlewares.UserContextKey, sellerUser)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req.WithContext(ctx))

		if rec.Code != http.StatusForbidden {
			t.Errorf("Expected status 403 Forbidden, got %d", rec.Code)
		}
	})

	t.Run("No user in context unauthorized -> 401 Unauthorized", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/admin", nil)
		rec := httptest.NewRecorder()

		mw.ServeHTTP(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("Expected status 401 Unauthorized, got %d", rec.Code)
		}
	})
}
