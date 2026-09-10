package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/services"
	"backend/internal/views"

	"github.com/golang-jwt/jwt/v5"
)

const errInvalidPayload = "Invalid request payload format"

type AuthController struct {
	authService services.AuthService
	jsonView    *views.JSONView
}

func NewAuthController(authService services.AuthService, jsonView *views.JSONView) *AuthController {
	return &AuthController{
		authService: authService,
		jsonView:    jsonView,
	}
}

func (c *AuthController) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	var req dto.GoogleAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	claims := jwt.MapClaims{}
	token, _, err := jwt.NewParser().ParseUnverified(req.IDToken, claims)
	if err != nil || token == nil {
		c.jsonView.Error(w, http.StatusBadRequest, "Invalid Firebase Google ID token", err)
		return
	}

	googleID, _ := claims["sub"].(string)
	email, _ := claims["email"].(string)
	name, _ := claims["name"].(string)

	if name == "" {
		name = email
	}

	tokenResp, err := c.authService.AuthenticateGoogleUser(r.Context(), email, name, googleID)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	if tokenResp.Status == models.StatusPending {
		statusCode := http.StatusAccepted
		msg := "User account is pending administrator approval"
		if tokenResp.IsNew {
			statusCode = http.StatusCreated
			msg = "User registered successfully. Pending administrator approval."
		}
		c.jsonView.Success(w, statusCode, msg, tokenResp)
		return
	}

	c.setRefreshTokenCookie(w, tokenResp.RefreshToken)
	c.jsonView.Success(w, http.StatusOK, "Login successful", tokenResp)
}

func (c *AuthController) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil || cookie.Value == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, "Refresh token cookie missing", nil)
		return
	}

	tokenResp, err := c.authService.RotateRefreshToken(r.Context(), cookie.Value)
	if err != nil {
		c.clearRefreshTokenCookie(w)
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.setRefreshTokenCookie(w, tokenResp.RefreshToken)
	c.jsonView.Success(w, http.StatusOK, "Token refreshed successfully", tokenResp)
}

func (c *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	if cookie, err := r.Cookie("refresh_token"); err == nil && cookie.Value != "" {
		_ = c.authService.Logout(r.Context(), cookie.Value)
	}

	c.clearRefreshTokenCookie(w)
	c.jsonView.Success(w, http.StatusOK, "Logged out successfully", nil)
}

func (c *AuthController) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.authService.ListUsers(r.Context())
	if err != nil {
		c.jsonView.Error(w, http.StatusInternalServerError, "", err)
		return
	}
	c.jsonView.Success(w, http.StatusOK, "Users retrieved successfully", users)
}

func (c *AuthController) UpdateUserStatus(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("id")
	if userID == "" {
		c.jsonView.Error(w, http.StatusBadRequest, "User ID path parameter is required", nil)
		return
	}

	var req dto.UpdateUserStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	if err := c.authService.UpdateUserStatus(r.Context(), userID, req.Status); err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "User status updated successfully", nil)
}

func (c *AuthController) UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("id")
	if userID == "" {
		c.jsonView.Error(w, http.StatusBadRequest, "User ID path parameter is required", nil)
		return
	}

	var req dto.UpdateUserRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	if err := c.authService.UpdateUserRole(r.Context(), userID, req.Role); err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "User role updated successfully", nil)
}

func (c *AuthController) setRefreshTokenCookie(w http.ResponseWriter, refreshToken string) {
	/* #nosec G124 */
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/api/auth",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
}

func (c *AuthController) clearRefreshTokenCookie(w http.ResponseWriter) {
	/* #nosec G124 */
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/api/auth",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
}
