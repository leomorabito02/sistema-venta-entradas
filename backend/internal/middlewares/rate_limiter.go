package middlewares

import (
	"fmt"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"backend/internal/views"
)

type clientState struct {
	requests     int
	windowStart  time.Time
	blockedUntil time.Time
}

type rateLimiterStore struct {
	mu            sync.Mutex
	clients       map[string]*clientState
	window        time.Duration
	maxRequests   int
	blockDuration time.Duration
}

func newRateLimiterStore(window time.Duration, maxRequests int, blockDuration time.Duration) *rateLimiterStore {
	store := &rateLimiterStore{
		clients:       make(map[string]*clientState),
		window:        window,
		maxRequests:   maxRequests,
		blockDuration: blockDuration,
	}

	// Periodic cleanup of stale client states to prevent memory leaks
	go func() {
		ticker := time.NewTicker(2 * window)
		for range ticker.C {
			store.mu.Lock()
			now := time.Now()
			for ip, state := range store.clients {
				if now.After(state.blockedUntil) && now.Sub(state.windowStart) > 2*window {
					delete(store.clients, ip)
				}
			}
			store.mu.Unlock()
		}
	}()

	return store
}

// extractIP extracts the client IP address from X-Forwarded-For, X-Real-IP, or RemoteAddr.
func extractIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// PublicTicketRateLimiter creates a middleware that restricts requests per IP for sensitive public endpoints.
// Purpose: Protect public ticket endpoints against scrapers, brute force, and DoS attacks.
// If requests exceed maxRequests within window, the IP is blocked for blockDuration (e.g., 1 minute).
func PublicTicketRateLimiter(window time.Duration, maxRequests int, blockDuration time.Duration, view *views.JSONView) func(http.Handler) http.Handler {
	store := newRateLimiterStore(window, maxRequests, blockDuration)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := extractIP(r)
			now := time.Now()

			store.mu.Lock()
			state, exists := store.clients[ip]
			if !exists {
				state = &clientState{
					requests:    1,
					windowStart: now,
				}
				store.clients[ip] = state
				store.mu.Unlock()
				next.ServeHTTP(w, r)
				return
			}

			// Check if currently blocked
			if now.Before(state.blockedUntil) {
				remainingSeconds := int(time.Until(state.blockedUntil).Seconds()) + 1
				store.mu.Unlock()

				w.Header().Set("Retry-After", fmt.Sprintf("%d", remainingSeconds))
				view.Error(w, http.StatusTooManyRequests, fmt.Sprintf("Too many requests. IP blocked for %d seconds", remainingSeconds), nil)
				return
			}

			// Reset window if window duration has passed
			if now.Sub(state.windowStart) > window {
				state.requests = 1
				state.windowStart = now
				state.blockedUntil = time.Time{}
				store.mu.Unlock()
				next.ServeHTTP(w, r)
				return
			}

			// Increment request count within current window
			state.requests++
			if state.requests > maxRequests {
				state.blockedUntil = now.Add(blockDuration)
				remainingSeconds := int(blockDuration.Seconds())
				store.mu.Unlock()

				w.Header().Set("Retry-After", fmt.Sprintf("%d", remainingSeconds))
				view.Error(w, http.StatusTooManyRequests, fmt.Sprintf("Rate limit exceeded. IP blocked for %d seconds", remainingSeconds), nil)
				return
			}

			store.mu.Unlock()
			next.ServeHTTP(w, r)
		})
	}
}
