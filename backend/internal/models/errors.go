package models

import (
	"errors"
	"fmt"
	"net/http"
)

// Common Sentinel Domain Errors
var (
	ErrNotFound                 = errors.New("resource not found")
	ErrInvalidInput             = errors.New("invalid input payload")
	ErrUnauthorized             = errors.New("unauthorized request")
	ErrForbidden                = errors.New("access forbidden")
	ErrQuotaExhausted           = errors.New("presale ticket quota exhausted")
	ErrTicketAnnulled           = errors.New("ticket is annulled")
	ErrInvalidStatusTransition = errors.New("invalid ticket status transition")
	ErrAlreadyExists            = errors.New("resource already exists")
)

// AppError represents a structured application error with HTTP status codes and context.
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	HTTPStatus int    `json:"-"`
	Err        error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func NewAppError(status int, code, message string, err error) *AppError {
	return &AppError{
		HTTPStatus: status,
		Code:       code,
		Message:    message,
		Err:        err,
	}
}

func NewBadRequestError(message string, err error) *AppError {
	return NewAppError(http.StatusBadRequest, "BAD_REQUEST", message, err)
}

func NewUnauthorizedError(message string, err error) *AppError {
	return NewAppError(http.StatusUnauthorized, "UNAUTHORIZED", message, err)
}

func NewNotFoundError(message string, err error) *AppError {
	return NewAppError(http.StatusNotFound, "NOT_FOUND", message, err)
}

func NewForbiddenError(message string, err error) *AppError {
	return NewAppError(http.StatusForbidden, "FORBIDDEN", message, err)
}

func NewConflictError(message string, err error) *AppError {
	return NewAppError(http.StatusConflict, "CONFLICT", message, err)
}

func NewInternalError(message string, err error) *AppError {
	return NewAppError(http.StatusInternalServerError, "INTERNAL_ERROR", message, err)
}
