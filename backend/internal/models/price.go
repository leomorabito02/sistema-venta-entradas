package models

import "time"

type TicketPrice struct {
	ID         string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	TicketType TicketType `gorm:"type:varchar(20);not null;uniqueIndex;check:ticket_type IN ('SIMPLE', 'CON_COMIDA')" json:"ticket_type"`
	Price      float64    `gorm:"type:numeric(10,2);not null;check:price >= 0" json:"price"`
	IsActive   bool       `gorm:"not null;default:true" json:"is_active"`
	CreatedAt  time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}

func (TicketPrice) TableName() string {
	return "ticket_prices"
}
