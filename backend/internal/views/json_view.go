package views

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"backend/internal/models"
)

// JSONView handles rendering of HTTP responses in JSON format.
type JSONView struct{}

// NewJSONView initializes and returns a new JSONView instance.
func NewJSONView() *JSONView {
	return &JSONView{}
}

// RenderJSON serializes payload data and writes JSON response with appropriate headers.
func (v *JSONView) RenderJSON(w http.ResponseWriter, statusCode int, payload models.Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(payload)
}

// Success renders a success response with status code, message, and data.
func (v *JSONView) Success(w http.ResponseWriter, statusCode int, message string, data interface{}) {
	v.RenderJSON(w, statusCode, models.Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Error renders an error response, automatically inspecting AppError instances if provided.
func (v *JSONView) Error(w http.ResponseWriter, statusCode int, message string, err error) {
	var appErr *models.AppError
	if errors.As(err, &appErr) {
		statusCode = appErr.HTTPStatus
		if message == "" {
			message = appErr.Message
		}
	}

	errStr := ""
	if err != nil {
		errStr = err.Error()
		log.Printf("[ERROR] %d %s: %v", statusCode, message, err)
	}

	v.RenderJSON(w, statusCode, models.Response{
		Success: false,
		Message: message,
		Error:   errStr,
	})
}

// RenderAppError directly renders an AppError struct.
func (v *JSONView) RenderAppError(w http.ResponseWriter, appErr *models.AppError) {
	v.RenderJSON(w, appErr.HTTPStatus, models.Response{
		Success: false,
		Message: appErr.Message,
		Error:   appErr.Error(),
	})
}
