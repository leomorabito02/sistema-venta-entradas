package dto

import (
	"fmt"
	"regexp"
	"strings"
	"time"

	"backend/internal/models"
)

var phoneRegex = regexp.MustCompile(`^[0-9+\-\s()]{6,20}$`)
var fourDigitCodeRegex = regexp.MustCompile(`^[0-9]{4}$`)

type CreateTicketRequest struct {
	TicketType models.TicketType `json:"ticket_type"`
	SaleSource models.SaleSource `json:"sale_source"`
	FirstName  string            `json:"first_name"`
	LastName   string            `json:"last_name"`
	Phone      string            `json:"phone"`
	Email      *string           `json:"email,omitempty"`
}

func (r *CreateTicketRequest) Validate() error {
	r.FirstName = strings.TrimSpace(r.FirstName)
	r.LastName = strings.TrimSpace(r.LastName)
	r.Phone = strings.TrimSpace(r.Phone)

	if r.FirstName == "" {
		return fmt.Errorf("first_name is required")
	}
	if r.LastName == "" {
		return fmt.Errorf("last_name is required")
	}
	if r.Phone == "" {
		return fmt.Errorf("phone is required")
	}
	if !phoneRegex.MatchString(r.Phone) {
		return fmt.Errorf("invalid phone format: %s", r.Phone)
	}

	if r.Email != nil {
		email := strings.TrimSpace(strings.ToLower(*r.Email))
		if email == "" {
			r.Email = nil
		} else {
			r.Email = &email
		}
	}

	switch r.TicketType {
	case models.TicketTypeSimple, models.TicketTypeConComida:
	default:
		return fmt.Errorf("invalid ticket_type: %s (must be SIMPLE or CON_COMIDA)", r.TicketType)
	}

	switch r.SaleSource {
	case models.SaleSourceAnticipada, models.SaleSourcePuerta:
	default:
		return fmt.Errorf("invalid sale_source: %s (must be ANTICIPADA or PUERTA)", r.SaleSource)
	}

	return nil
}

type ValidateTicketRequest struct {
	PublicToken    string                `json:"public_token,omitempty"`
	FourDigitCode  string                `json:"four_digit_code,omitempty"`
	ValidationType models.ValidationType `json:"validation_type"`
}

func (r *ValidateTicketRequest) Validate() error {
	r.PublicToken = strings.TrimSpace(r.PublicToken)
	r.FourDigitCode = strings.TrimSpace(r.FourDigitCode)

	if r.PublicToken == "" && r.FourDigitCode == "" {
		return fmt.Errorf("either public_token or four_digit_code must be provided")
	}

	if r.FourDigitCode != "" && !fourDigitCodeRegex.MatchString(r.FourDigitCode) {
		return fmt.Errorf("four_digit_code must be exactly 4 digits")
	}

	switch r.ValidationType {
	case models.ValidationTypeEntrada, models.ValidationTypeComida:
	default:
		return fmt.Errorf("invalid validation_type: %s (must be ENTRADA or COMIDA)", r.ValidationType)
	}

	return nil
}

type TicketResponse struct {
	ID            string              `json:"id"`
	TicketNumber  int64               `json:"ticket_number"`
	PublicToken   string              `json:"public_token"`
	PublicURL     string              `json:"public_url"`
	FourDigitCode string              `json:"four_digit_code"`
	TicketType    models.TicketType   `json:"ticket_type"`
	SaleSource    models.SaleSource   `json:"sale_source"`
	QuotaSource   *models.QuotaSource `json:"quota_source,omitempty"`
	PricePaid     float64             `json:"price_paid"`
	Status        models.TicketStatus `json:"status"`
	Buyer         *models.Buyer       `json:"buyer,omitempty"`
	SellerID      string              `json:"seller_id"`
	Seller        *UserResponse       `json:"seller,omitempty"`
	CreatedAt     time.Time           `json:"created_at"`
}

type TicketPublicResponse struct {
	TicketNumber  int64               `json:"ticket_number"`
	FourDigitCode string              `json:"four_digit_code"`
	PublicToken   string              `json:"public_token"`
	TicketType    models.TicketType   `json:"ticket_type"`
	SaleSource    models.SaleSource   `json:"sale_source"`
	Status        models.TicketStatus `json:"status"`
	PricePaid     float64             `json:"price_paid"`
	BuyerName     string              `json:"buyer_name"`
	SellerName    string              `json:"seller_name"`
	IncludesFood  bool                `json:"includes_food"`
	CreatedAt     time.Time           `json:"created_at"`
}

type TicketPriceResponse struct {
	TicketType models.TicketType `json:"ticket_type"`
	Price      float64           `json:"price"`
}

type UpdateTicketPriceRequest struct {
	TicketType models.TicketType `json:"ticket_type"`
	Price      float64           `json:"price"`
}

func (r *UpdateTicketPriceRequest) Validate() error {
	switch r.TicketType {
	case models.TicketTypeSimple, models.TicketTypeConComida:
	default:
		return fmt.Errorf("invalid ticket_type: %s (must be SIMPLE or CON_COMIDA)", r.TicketType)
	}
	if r.Price < 0 {
		return fmt.Errorf("price cannot be negative")
	}
	return nil
}
