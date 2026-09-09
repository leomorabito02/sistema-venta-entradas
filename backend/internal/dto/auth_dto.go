package dto

import (
	"fmt"
	"strings"

	"backend/internal/models"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (r *LoginRequest) Validate() error {
	r.Email = strings.TrimSpace(strings.ToLower(r.Email))
	if r.Email == "" {
		return fmt.Errorf("email is required")
	}
	if r.Password == "" {
		return fmt.Errorf("password is required")
	}
	return nil
}

type GoogleAuthRequest struct {
	IDToken string `json:"id_token"`
}

func (r *GoogleAuthRequest) Validate() error {
	r.IDToken = strings.TrimSpace(r.IDToken)
	if r.IDToken == "" {
		return fmt.Errorf("id_token is required")
	}
	return nil
}

type UserResponse struct {
	ID       string            `json:"id"`
	Email    string            `json:"email"`
	Name     string            `json:"name"`
	Role     models.UserRole   `json:"role"`
	Status   models.UserStatus `json:"status"`
}

type TokenResponse struct {
	AccessToken  string        `json:"access_token"`
	TokenType    string        `json:"token_type"`
	ExpiresIn    int64         `json:"expires_in"`
	User         *UserResponse `json:"user"`
	RefreshToken string        `json:"-"` // Delivered in HttpOnly cookie
}

type UpdateUserStatusRequest struct {
	Status models.UserStatus `json:"status"`
}

func (r *UpdateUserStatusRequest) Validate() error {
	switch r.Status {
	case models.StatusPending, models.StatusActive, models.StatusDisabled:
		return nil
	default:
		return fmt.Errorf("invalid user status: %s (must be PENDING, ACTIVE, or DISABLED)", r.Status)
	}
}

type UpdateUserRoleRequest struct {
	Role models.UserRole `json:"role"`
}

func (r *UpdateUserRoleRequest) Validate() error {
	switch r.Role {
	case models.RoleAdmin, models.RoleSeller:
		return nil
	default:
		return fmt.Errorf("invalid user role: %s (must be ADMIN or SELLER)", r.Role)
	}
}
