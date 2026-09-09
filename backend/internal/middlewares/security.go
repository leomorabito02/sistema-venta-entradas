package middlewares

import (
	"log"
	"net/http"

	"backend/internal/models"
	"backend/internal/views"
)

// SecurityHeaders applies OWASP recommended security headers to incoming HTTP requests.
// Purpose: Protect against common web vulnerabilities like XSS, Clickjacking, and MIME sniffing.
// Params: next (http.Handler).
// Returns: http.Handler wrapping security header injection.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		next.ServeHTTP(w, r)
	})
}

// MaxBodySize restricts request body size to mitigate Denial of Service (DoS) attacks.
// Purpose: Enforce payload size constraints at HTTP entry point.
// Params: maxBytes (int64), view (*views.JSONView).
// Returns: Middleware function returning http.Handler.
func MaxBodySize(maxBytes int64, view *views.JSONView) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Body != nil {
				r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
			}
			next.ServeHTTP(w, r)
		})
	}
}

// Recovery intercepts application panics and returns a generic 500 error payload without leaking internal state.
// Purpose: Prevent sensitive detail disclosure during unexpected execution failures.
// Params: next (http.Handler), view (*views.JSONView).
// Returns: http.Handler wrapping panic recovery logic.
func Recovery(view *views.JSONView) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					log.Printf("Panic recovered: %v", err)
					view.RenderJSON(w, http.StatusInternalServerError, models.Response{
						Success: false,
						Error:   "Internal server error",
					})
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

// isOriginAllowed checks if the incoming origin matches any allowed origin rule.
func isOriginAllowed(origin string, allowedOrigins []string) bool {
	if origin == "" {
		return false
	}
	for _, allowed := range allowedOrigins {
		if allowed == "*" || allowed == origin {
			return true
		}
	}
	return false
}

// CORS handles Cross-Origin Resource Sharing with OWASP security controls and credential support.
// Purpose: Manage allowed origins, HTTP methods, headers, and OPTIONS preflight requests.
// Params: allowedOrigins ([]string).
// Returns: Middleware function returning http.Handler.
func CORS(allowedOrigins []string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if isOriginAllowed(origin, allowedOrigins) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, X-Content-Type-Options")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// isStateChangingMethod determines if an HTTP method mutates state and requires anti-CSRF headers.
func isStateChangingMethod(method string) bool {
	switch method {
	case http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodPatch:
		return true
	default:
		return false
	}
}

// ValidateAntiCSRF verifies custom headers on state-changing HTTP requests to defend against CSRF forgery.
// Purpose: Ensure requests carry custom headers (X-Requested-With) which cross-site HTML forms cannot attach.
// Params: view (*views.JSONView).
// Returns: Middleware function wrapping http.Handler.
func ValidateAntiCSRF(view *views.JSONView) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if isStateChangingMethod(r.Method) && r.Header.Get("X-Requested-With") == "" {
				view.Error(w, http.StatusForbidden, "CSRF protection: X-Requested-With header required", nil)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
