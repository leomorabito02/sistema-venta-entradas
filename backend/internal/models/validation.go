package models

import "time"

type ValidationType string

const (
	ValidationTypeEntrada   ValidationType = "ENTRADA"
	ValidationTypeComida    ValidationType = "COMIDA"
	ValidationTypeAnulacion ValidationType = "ANULACION"
)

type TicketValidation struct {
	ID             string         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	TicketID       string         `gorm:"type:uuid;not null;index" json:"ticket_id"`
	ValidationType ValidationType `gorm:"type:varchar(20);not null;check:validation_type IN ('ENTRADA', 'COMIDA', 'ANULACION')" json:"validation_type"`
	ValidatedBy    string         `gorm:"type:uuid;not null" json:"validated_by"`
	PreviousStatus TicketStatus   `gorm:"type:varchar(20);not null" json:"previous_status"`
	NewStatus      TicketStatus   `gorm:"type:varchar(20);not null" json:"new_status"`
	Notes          *string        `gorm:"type:text" json:"notes,omitempty"`
	ValidatedAt    time.Time      `gorm:"autoCreateTime" json:"validated_at"`
}

func (TicketValidation) TableName() string {
	return "ticket_validations"
}
