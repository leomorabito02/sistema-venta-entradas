package models

import "time"

type RefreshToken struct {
	ID        string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    string     `gorm:"type:uuid;not null;index" json:"user_id"`
	TokenHash string     `gorm:"type:varchar(64);not null;uniqueIndex" json:"token_hash"`
	ExpiresAt time.Time  `gorm:"not null" json:"expires_at"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
	RevokedAt *time.Time `json:"revoked_at,omitempty"`
}

func (RefreshToken) TableName() string {
	return "refresh_tokens"
}

func (r *RefreshToken) IsActive() bool {
	return r.RevokedAt == nil && time.Now().Before(r.ExpiresAt)
}
