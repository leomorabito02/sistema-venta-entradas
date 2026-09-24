package middlewares

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"backend/internal/views"
)

func TestPublicTicketRateLimiter(t *testing.T) {
	view := views.NewJSONView()
	// Allow 3 requests per 500ms, block for 1s on threshold breach
	limiter := PublicTicketRateLimiter(500*time.Millisecond, 3, 1*time.Second, view)

	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	})

	handler := limiter(dummyHandler)

	req := func(ip string) *http.Request {
		r := httptest.NewRequest("GET", "/api/tickets/public/token123", nil)
		r.RemoteAddr = ip + ":12345"
		return r
	}

	ip := "192.168.1.100"

	// 1st request -> 200 OK
	w1 := httptest.NewRecorder()
	handler.ServeHTTP(w1, req(ip))
	if w1.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for request 1, got %d", w1.Code)
	}

	// 2nd request -> 200 OK
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req(ip))
	if w2.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for request 2, got %d", w2.Code)
	}

	// 3rd request -> 200 OK
	w3 := httptest.NewRecorder()
	handler.ServeHTTP(w3, req(ip))
	if w3.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for request 3, got %d", w3.Code)
	}

	// 4th request -> 429 Too Many Requests
	w4 := httptest.NewRecorder()
	handler.ServeHTTP(w4, req(ip))
	if w4.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests for request 4, got %d", w4.Code)
	}
	if w4.Header().Get("Retry-After") == "" {
		t.Errorf("expected Retry-After header to be set")
	}

	// 5th request during block period -> 429 Too Many Requests
	w5 := httptest.NewRecorder()
	handler.ServeHTTP(w5, req(ip))
	if w5.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 Too Many Requests while blocked, got %d", w5.Code)
	}

	// Wait for block duration to expire (1s + buffer)
	time.Sleep(1100 * time.Millisecond)

	// 6th request after block expires -> 200 OK
	w6 := httptest.NewRecorder()
	handler.ServeHTTP(w6, req(ip))
	if w6.Code != http.StatusOK {
		t.Fatalf("expected 200 OK after block expired, got %d", w6.Code)
	}
}

func TestExtractIP(t *testing.T) {
	tests := []struct {
		name       string
		headers    map[string]string
		remoteAddr string
		expectedIP string
	}{
		{
			name:       "X-Forwarded-For with multiple IPs",
			headers:    map[string]string{"X-Forwarded-For": "203.0.113.195, 70.41.3.18, 150.172.238.178"},
			remoteAddr: "127.0.0.1:1234",
			expectedIP: "203.0.113.195",
		},
		{
			name:       "X-Real-IP present",
			headers:    map[string]string{"X-Real-IP": "198.51.100.1"},
			remoteAddr: "127.0.0.1:1234",
			expectedIP: "198.51.100.1",
		},
		{
			name:       "RemoteAddr with port",
			headers:    map[string]string{},
			remoteAddr: "192.0.2.1:54321",
			expectedIP: "192.0.2.1",
		},
		{
			name:       "RemoteAddr without port",
			headers:    map[string]string{},
			remoteAddr: "192.0.2.1",
			expectedIP: "192.0.2.1",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/", nil)
			req.RemoteAddr = tt.remoteAddr
			for k, v := range tt.headers {
				req.Header.Set(k, v)
			}
			ip := extractIP(req)
			if ip != tt.expectedIP {
				t.Errorf("expected IP %q, got %q", tt.expectedIP, ip)
			}
		})
	}
}
