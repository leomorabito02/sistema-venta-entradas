package middlewares_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/middlewares"
	"backend/internal/views"
)

func TestCORS(t *testing.T) {
	allowedOrigins := []string{"http://localhost:4200"}
	corsHandler := middlewares.CORS(allowedOrigins)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	}))

	t.Run("Allowed Origin with Preflight OPTIONS", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodOptions, "/api/tickets", nil)
		req.Header.Set("Origin", "http://localhost:4200")
		rec := httptest.NewRecorder()

		corsHandler.ServeHTTP(rec, req)

		if rec.Code != http.StatusNoContent {
			t.Errorf("Expected status 204 No Content for OPTIONS, got %d", rec.Code)
		}
		if rec.Header().Get("Access-Control-Allow-Origin") != "http://localhost:4200" {
			t.Errorf("Expected Access-Control-Allow-Origin header to be http://localhost:4200, got %s", rec.Header().Get("Access-Control-Allow-Origin"))
		}
		if rec.Header().Get("Access-Control-Allow-Credentials") != "true" {
			t.Errorf("Expected Access-Control-Allow-Credentials header to be true, got %s", rec.Header().Get("Access-Control-Allow-Credentials"))
		}
	})

	t.Run("Disallowed Origin", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/tickets", nil)
		req.Header.Set("Origin", "http://malicious-site.com")
		rec := httptest.NewRecorder()

		corsHandler.ServeHTTP(rec, req)

		if rec.Header().Get("Access-Control-Allow-Origin") != "" {
			t.Errorf("Expected Access-Control-Allow-Origin header to be empty for disallowed origin, got %s", rec.Header().Get("Access-Control-Allow-Origin"))
		}
	})
}

func TestValidateAntiCSRF(t *testing.T) {
	jsonView := views.NewJSONView()
	csrfMW := middlewares.ValidateAntiCSRF(jsonView)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	t.Run("POST without X-Requested-With header fails with 403", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/tickets", nil)
		rec := httptest.NewRecorder()

		csrfMW.ServeHTTP(rec, req)

		if rec.Code != http.StatusForbidden {
			t.Errorf("Expected status 403 Forbidden, got %d", rec.Code)
		}
	})

	t.Run("POST with X-Requested-With header succeeds with 200", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/tickets", nil)
		req.Header.Set("X-Requested-With", "XMLHttpRequest")
		rec := httptest.NewRecorder()

		csrfMW.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("Expected status 200 OK, got %d", rec.Code)
		}
	})
}

func TestRequestLogger(t *testing.T) {
	loggerMW := middlewares.RequestLogger(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
	}))

	req := httptest.NewRequest(http.MethodPost, "/api/tickets", nil)
	rec := httptest.NewRecorder()

	loggerMW.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Errorf("Expected status 201 Created, got %d", rec.Code)
	}
}
