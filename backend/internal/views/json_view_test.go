package views_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/models"
	"backend/internal/views"
)

func TestJSONView_Success(t *testing.T) {
	v := views.NewJSONView()
	rec := httptest.NewRecorder()

	v.Success(rec, http.StatusOK, "Operation successful", map[string]string{"foo": "bar"})

	if rec.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rec.Code)
	}

	if rec.Header().Get("Content-Type") != "application/json" {
		t.Errorf("Expected Content-Type application/json, got %s", rec.Header().Get("Content-Type"))
	}

	var resp models.Response
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if !resp.Success || resp.Message != "Operation successful" {
		t.Errorf("Unexpected response content: %+v", resp)
	}
}

func TestJSONView_ErrorWithAppError(t *testing.T) {
	v := views.NewJSONView()
	rec := httptest.NewRecorder()

	appErr := models.NewBadRequestError("Invalid input parameters", errors.New("field required"))
	v.Error(rec, http.StatusInternalServerError, "", appErr) // Status should be overridden by AppError status (400)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 from AppError, got %d", rec.Code)
	}

	var resp models.Response
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if resp.Success || resp.Message != "Invalid input parameters" {
		t.Errorf("Unexpected error response content: %+v", resp)
	}
}

func TestJSONView_ErrorWithGenericError(t *testing.T) {
	v := views.NewJSONView()
	rec := httptest.NewRecorder()

	genErr := errors.New("db connection failure")
	v.Error(rec, http.StatusInternalServerError, "Internal failure", genErr)

	if rec.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", rec.Code)
	}

	var resp models.Response
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if resp.Success || resp.Message != "Internal failure" || resp.Error != "db connection failure" {
		t.Errorf("Unexpected error response content: %+v", resp)
	}
}

func TestJSONView_RenderAppError(t *testing.T) {
	v := views.NewJSONView()
	rec := httptest.NewRecorder()

	appErr := models.NewNotFoundError("User not found", nil)
	v.RenderAppError(rec, appErr)

	if rec.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", rec.Code)
	}

	var resp models.Response
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	if resp.Success || resp.Message != "User not found" {
		t.Errorf("Unexpected response content: %+v", resp)
	}
}
