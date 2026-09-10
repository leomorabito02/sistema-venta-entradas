package models_test

import (
	"errors"
	"net/http"
	"testing"

	"backend/internal/models"
)

func TestAppError_ErrorAndUnwrap(t *testing.T) {
	baseErr := errors.New("underlying DB error")
	appErr := models.NewAppError(http.StatusInternalServerError, "INTERNAL_ERROR", "Operation failed", baseErr)

	if appErr.Error() != "Operation failed: underlying DB error" {
		t.Errorf("Unexpected Error() output: %s", appErr.Error())
	}

	if !errors.Is(appErr, baseErr) {
		t.Errorf("Expected errors.Is to match baseErr via Unwrap()")
	}

	appErrNil := models.NewAppError(http.StatusBadRequest, "BAD_REQUEST", "Simple error", nil)
	if appErrNil.Error() != "Simple error" {
		t.Errorf("Unexpected Error() output without inner error: %s", appErrNil.Error())
	}
}

func TestAppError_Constructors(t *testing.T) {
	err := errors.New("test cause")

	tests := []struct {
		name           string
		appErr         *models.AppError
		expectedCode   string
		expectedStatus int
	}{
		{
			name:           "NewBadRequestError",
			appErr:         models.NewBadRequestError("bad req", err),
			expectedCode:   "BAD_REQUEST",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "NewUnauthorizedError",
			appErr:         models.NewUnauthorizedError("unauth", err),
			expectedCode:   "UNAUTHORIZED",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "NewNotFoundError",
			appErr:         models.NewNotFoundError("not found", err),
			expectedCode:   "NOT_FOUND",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "NewForbiddenError",
			appErr:         models.NewForbiddenError("forbidden", err),
			expectedCode:   "FORBIDDEN",
			expectedStatus: http.StatusForbidden,
		},
		{
			name:           "NewConflictError",
			appErr:         models.NewConflictError("conflict", err),
			expectedCode:   "CONFLICT",
			expectedStatus: http.StatusConflict,
		},
		{
			name:           "NewInternalError",
			appErr:         models.NewInternalError("internal", err),
			expectedCode:   "INTERNAL_ERROR",
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.appErr.Code != tt.expectedCode {
				t.Errorf("Expected code %s, got %s", tt.expectedCode, tt.appErr.Code)
			}
			if tt.appErr.HTTPStatus != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, tt.appErr.HTTPStatus)
			}
		})
	}
}

func TestModelTableNames(t *testing.T) {
	if (models.TicketValidation{}).TableName() != "ticket_validations" {
		t.Errorf("Unexpected table name for TicketValidation")
	}
	if (models.Ticket{}).TableName() != "tickets" {
		t.Errorf("Unexpected table name for Ticket")
	}
	if (models.Buyer{}).TableName() != "buyers" {
		t.Errorf("Unexpected table name for Buyer")
	}
	if (models.User{}).TableName() != "users" {
		t.Errorf("Unexpected table name for User")
	}
	if (models.SellerQuota{}).TableName() != "seller_quotas" {
		t.Errorf("Unexpected table name for SellerQuota")
	}
	if (models.GlobalFreeQuota{}).TableName() != "global_free_quotas" {
		t.Errorf("Unexpected table name for GlobalFreeQuota")
	}
	if (models.QuotaAuditLog{}).TableName() != "quota_audit_logs" {
		t.Errorf("Unexpected table name for QuotaAuditLog")
	}
	if (models.TicketPrice{}).TableName() != "ticket_prices" {
		t.Errorf("Unexpected table name for TicketPrice")
	}
}
