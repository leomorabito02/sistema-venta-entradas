package models

import "time"

type Buyer struct {
	ID        string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	FirstName string    `gorm:"type:varchar(100);not null" json:"first_name"`
	LastName  string    `gorm:"type:varchar(100);not null" json:"last_name"`
	Phone     string    `gorm:"type:varchar(50);not null" json:"phone"`
	Email     *string   `gorm:"type:varchar(255)" json:"email,omitempty"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Buyer) TableName() string {
	return "buyers"
}
