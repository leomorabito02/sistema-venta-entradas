package models

import "time"

type UserRole string

const (
	RoleAdmin  UserRole = "ADMIN"
	RoleSeller UserRole = "SELLER"
)

type UserStatus string

const (
	StatusPending  UserStatus = "PENDING"
	StatusActive   UserStatus = "ACTIVE"
	StatusDisabled UserStatus = "DISABLED"
)

type User struct {
	ID           string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string     `gorm:"type:varchar(255);not null;uniqueIndex" json:"email"`
	Name         string     `gorm:"type:varchar(255);not null" json:"name"`
	GoogleID     *string    `gorm:"type:varchar(255);uniqueIndex" json:"google_id,omitempty"`
	Role         UserRole   `gorm:"type:varchar(20);not null;check:role IN ('ADMIN', 'SELLER')" json:"role"`
	Status       UserStatus `gorm:"type:varchar(20);not null;default:'PENDING';check:status IN ('PENDING', 'ACTIVE', 'DISABLED')" json:"status"`
	PasswordHash *string    `gorm:"type:varchar(255)" json:"-"`
	CreatedAt    time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
