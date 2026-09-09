package controllers

import (
	"net/http"
	"time"

	"backend/internal/models"
	"backend/internal/views"
)

// HealthController manages status and health check HTTP handlers.
type HealthController struct {
	startTime time.Time
	view      *views.JSONView
}

// NewHealthController initializes a HealthController instance with application start timestamp.
func NewHealthController(view *views.JSONView) *HealthController {
	return &HealthController{
		startTime: time.Now(),
		view:      view,
	}
}

// Health handles HTTP request for application health check endpoint.
// Purpose: Provide health status and application uptime in JSON format.
// Params: w (http.ResponseWriter), r (*http.Request).
// Returns: None (writes HTTP response via view layer).
func (c *HealthController) Health(w http.ResponseWriter, r *http.Request) {
	status := models.HealthStatus{
		Status:    "OK",
		Timestamp: time.Now(),
		Uptime:    time.Since(c.startTime).String(),
	}

	response := models.Response{
		Success: true,
		Data:    status,
	}

	c.view.RenderJSON(w, http.StatusOK, response)
}
