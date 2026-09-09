package dto_test

import (
	"testing"

	"backend/internal/dto"
	"backend/internal/models"
)

func TestCreateTicketRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     dto.CreateTicketRequest
		wantErr bool
	}{
		{
			name: "Valid request",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "+54 9 11 1234 5678",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: false,
		},
		{
			name: "Missing first name",
			req: dto.CreateTicketRequest{
				FirstName:  "",
				LastName:   "Doe",
				Phone:      "12345678",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Invalid phone",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "abc",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Invalid ticket type",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "12345678",
				TicketType: "VIP",
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateTicketRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     dto.ValidateTicketRequest
		wantErr bool
	}{
		{
			name: "Valid token",
			req: dto.ValidateTicketRequest{
				PublicToken:    "abc123token",
				ValidationType: models.ValidationTypeEntrada,
			},
			wantErr: false,
		},
		{
			name: "Valid 4 digit code",
			req: dto.ValidateTicketRequest{
				FourDigitCode:  "1234",
				ValidationType: models.ValidationTypeComida,
			},
			wantErr: false,
		},
		{
			name: "Invalid 4 digit code non numeric",
			req: dto.ValidateTicketRequest{
				FourDigitCode:  "12a4",
				ValidationType: models.ValidationTypeEntrada,
			},
			wantErr: true,
		},
		{
			name: "Missing token and code",
			req: dto.ValidateTicketRequest{
				ValidationType: models.ValidationTypeEntrada,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
