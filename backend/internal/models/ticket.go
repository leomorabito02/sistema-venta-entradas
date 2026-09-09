package models

import "time"

type TicketType string

const (
	TicketTypeSimple    TicketType = "SIMPLE"
	TicketTypeConComida TicketType = "CON_COMIDA"
)

type SaleSource string

const (
	SaleSourceAnticipada SaleSource = "ANTICIPADA"
	SaleSourcePuerta     SaleSource = "PUERTA"
)

type QuotaSource string

const (
	QuotaSourcePersonal QuotaSource = "PERSONAL"
	QuotaSourceLibre    QuotaSource = "LIBRE"
)

type TicketStatus string

const (
	TicketStatusVendido      TicketStatus = "VENDIDO"
	TicketStatusUsadoEntrada TicketStatus = "USADO_ENTRADA"
	TicketStatusUsadoComida  TicketStatus = "USADO_COMIDA"
	TicketStatusAnulado      TicketStatus = "ANULADO"
)

type Ticket struct {
	ID            string       `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	TicketNumber  int64        `gorm:"autoIncrement;unique;not null" json:"ticket_number"`
	PublicToken   string       `gorm:"type:varchar(64);not null;uniqueIndex" json:"public_token"`
	FourDigitCode string       `gorm:"type:varchar(4);not null;uniqueIndex" json:"four_digit_code"`
	TicketType    TicketType   `gorm:"type:varchar(20);not null;check:ticket_type IN ('SIMPLE', 'CON_COMIDA')" json:"ticket_type"`
	SaleSource    SaleSource   `gorm:"type:varchar(20);not null;check:sale_source IN ('ANTICIPADA', 'PUERTA')" json:"sale_source"`
	QuotaSource   *QuotaSource `gorm:"type:varchar(20);check:quota_source IN ('PERSONAL', 'LIBRE')" json:"quota_source,omitempty"`
	PricePaid     float64      `gorm:"type:numeric(10,2);not null;check:price_paid >= 0" json:"price_paid"`
	Status        TicketStatus `gorm:"type:varchar(20);not null;default:'VENDIDO';check:status IN ('VENDIDO', 'USADO_ENTRADA', 'USADO_COMIDA', 'ANULADO')" json:"status"`
	BuyerID       string       `gorm:"type:uuid;not null;index" json:"buyer_id"`
	SellerID      string       `gorm:"type:uuid;not null;index" json:"seller_id"`
	CreatedAt     time.Time    `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time    `gorm:"autoUpdateTime" json:"updated_at"`

	Buyer  *Buyer `gorm:"foreignKey:BuyerID" json:"buyer,omitempty"`
	Seller *User  `gorm:"foreignKey:SellerID" json:"seller,omitempty"`
}

func (Ticket) TableName() string {
	return "tickets"
}
