package services

import (
	"context"
	"time"

	"backend/internal/dto"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/security"
)

type AuthService interface {
	GetUserByID(ctx context.Context, id string) (*dto.UserResponse, error)
	AuthenticateGoogleUser(ctx context.Context, email, name, googleID string) (*dto.TokenResponse, error)
	RotateRefreshToken(ctx context.Context, rawRefreshToken string) (*dto.TokenResponse, error)
	Logout(ctx context.Context, rawRefreshToken string) error
	ListUsers(ctx context.Context) ([]*dto.UserResponse, error)
	UpdateUserStatus(ctx context.Context, id string, status models.UserStatus) error
	UpdateUserRole(ctx context.Context, id string, role models.UserRole) error
}

const (
	errUserIDRequired = "User ID is required"
	errUserNotFound   = "User not found"
)

type authService struct {
	userRepo  repository.UserRepository
	tokenRepo repository.TokenRepository
}

func NewAuthService(userRepo repository.UserRepository, tokenRepo repository.TokenRepository) AuthService {
	return &authService{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
	}
}

func (s *authService) GetUserByID(ctx context.Context, id string) (*dto.UserResponse, error) {
	if id == "" {
		return nil, models.NewBadRequestError(errUserIDRequired, nil)
	}

	u, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, models.NewNotFoundError(errUserNotFound, err)
	}
	return s.toUserResponse(u), nil
}

func (s *authService) AuthenticateGoogleUser(ctx context.Context, email, name, googleID string) (*dto.TokenResponse, error) {
	if googleID == "" || email == "" {
		return nil, models.NewBadRequestError("google_id and email are required", nil)
	}

	user, isNew, err := s.userRepo.UpsertGoogleUser(ctx, email, name, googleID)
	if err != nil {
		return nil, models.NewInternalError("Failed to upsert Google user account", err)
	}

	if isNew || user.Status == models.StatusPending {
		return &dto.TokenResponse{
			User:   s.toUserResponse(user),
			Status: models.StatusPending,
			IsNew:  isNew,
		}, nil
	}

	if user.Status == models.StatusDisabled {
		return nil, models.NewForbiddenError("User account is DISABLED", nil)
	}

	tokenResp, err := s.issueTokens(ctx, user)
	if err != nil {
		return nil, err
	}
	tokenResp.Status = user.Status
	tokenResp.IsNew = isNew
	return tokenResp, nil
}

func (s *authService) RotateRefreshToken(ctx context.Context, rawRefreshToken string) (*dto.TokenResponse, error) {
	if rawRefreshToken == "" {
		return nil, models.NewUnauthorizedError("Refresh token missing", nil)
	}

	tokenHash := security.HashToken(rawRefreshToken)
	tokenRecord, err := s.tokenRepo.GetByHash(ctx, tokenHash)
	if err != nil || tokenRecord == nil {
		return nil, models.NewUnauthorizedError("Invalid or revoked refresh token", err)
	}

	if !tokenRecord.IsActive() {
		// OWASP Token Reuse Detection: Revoke all tokens for this user if a revoked token is reused!
		_ = s.tokenRepo.RevokeAllUserTokens(ctx, tokenRecord.UserID)
		return nil, models.NewUnauthorizedError("Refresh token expired or revoked", nil)
	}

	// Revoke current refresh token (OWASP Refresh Token Rotation)
	if err := s.tokenRepo.RevokeToken(ctx, tokenHash); err != nil {
		return nil, models.NewInternalError("Failed to revoke refresh token", err)
	}

	user, err := s.userRepo.GetByID(ctx, tokenRecord.UserID)
	if err != nil {
		return nil, models.NewNotFoundError("User not found for token", err)
	}

	if user.Status != models.StatusActive {
		return nil, models.NewForbiddenError("User account is no longer active", nil)
	}

	return s.issueTokens(ctx, user)
}

func (s *authService) Logout(ctx context.Context, rawRefreshToken string) error {
	if rawRefreshToken == "" {
		return nil
	}
	tokenHash := security.HashToken(rawRefreshToken)
	return s.tokenRepo.RevokeToken(ctx, tokenHash)
}

func (s *authService) ListUsers(ctx context.Context) ([]*dto.UserResponse, error) {
	users, err := s.userRepo.List(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to list users", err)
	}
	res := make([]*dto.UserResponse, len(users))
	for i, u := range users {
		res[i] = s.toUserResponse(u)
	}
	return res, nil
}

func (s *authService) UpdateUserStatus(ctx context.Context, id string, status models.UserStatus) error {
	if id == "" {
		return models.NewBadRequestError(errUserIDRequired, nil)
	}

	if currentUser, ok := middlewares.GetUserFromContext(ctx); ok && currentUser != nil && currentUser.ID == id {
		return models.NewForbiddenError("Administrators cannot change their own account status", nil)
	}

	u, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return models.NewNotFoundError(errUserNotFound, err)
	}

	u.Status = status
	if err := s.userRepo.Update(ctx, u); err != nil {
		return models.NewInternalError("Failed to update user status", err)
	}
	return nil
}

func (s *authService) UpdateUserRole(ctx context.Context, id string, role models.UserRole) error {
	if id == "" {
		return models.NewBadRequestError(errUserIDRequired, nil)
	}

	if currentUser, ok := middlewares.GetUserFromContext(ctx); ok && currentUser != nil && currentUser.ID == id {
		return models.NewForbiddenError("Administrators cannot change their own role", nil)
	}

	u, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return models.NewNotFoundError(errUserNotFound, err)
	}

	u.Role = role
	if err := s.userRepo.Update(ctx, u); err != nil {
		return models.NewInternalError("Failed to update user role", err)
	}
	return nil
}

func (s *authService) issueTokens(ctx context.Context, user *models.User) (*dto.TokenResponse, error) {
	accessToken, expiresIn, err := security.GenerateAccessToken(user)
	if err != nil {
		return nil, models.NewInternalError("Failed to generate access token", err)
	}

	rawRefreshToken, err := security.GenerateRefreshToken()
	if err != nil {
		return nil, models.NewInternalError("Failed to generate refresh token", err)
	}

	refreshTokenHash := security.HashToken(rawRefreshToken)
	refreshRecord := &models.RefreshToken{
		UserID:    user.ID,
		TokenHash: refreshTokenHash,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 days lifetime
	}

	if err := s.tokenRepo.CreateRefreshToken(ctx, refreshRecord); err != nil {
		return nil, models.NewInternalError("Failed to store refresh token", err)
	}

	return &dto.TokenResponse{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    expiresIn,
		User:         s.toUserResponse(user),
		RefreshToken: rawRefreshToken,
	}, nil
}

func (s *authService) toUserResponse(u *models.User) *dto.UserResponse {
	return &dto.UserResponse{
		ID:     u.ID,
		Email:  u.Email,
		Name:   u.Name,
		Role:   u.Role,
		Status: u.Status,
	}
}
