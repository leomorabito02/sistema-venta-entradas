package dto_test

import (
	"testing"

	"backend/internal/dto"
	"backend/internal/models"
)

func TestCreateTicketRequest_Validate(t *testing.T) {
	validEmail := "TEST@Example.com"
	emptyEmail := "   "

	tests := []struct {
		name      string
		req       dto.CreateTicketRequest
		wantErr   bool
		checkEmail *string
	}{
		{
			name: "Valid request with email",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "+54 9 11 1234 5678",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
				Email:      &validEmail,
			},
			wantErr: false,
		},
		{
			name: "Valid request with empty string email sanitized to nil",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "12345678",
				TicketType: models.TicketTypeConComida,
				SaleSource: models.SaleSourcePuerta,
				Email:      &emptyEmail,
			},
			wantErr: false,
		},
		{
			name: "Missing first name",
			req: dto.CreateTicketRequest{
				FirstName:  "   ",
				LastName:   "Doe",
				Phone:      "12345678",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Missing last name",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "",
				Phone:      "12345678",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Missing phone",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "",
				TicketType: models.TicketTypeSimple,
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Invalid phone format with letters",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "abc12345",
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
				TicketType: "INVALID_TYPE",
				SaleSource: models.SaleSourceAnticipada,
			},
			wantErr: true,
		},
		{
			name: "Invalid sale source",
			req: dto.CreateTicketRequest{
				FirstName:  "John",
				LastName:   "Doe",
				Phone:      "12345678",
				TicketType: models.TicketTypeSimple,
				SaleSource: "INVALID_SOURCE",
			},
			wantErr: true,
		},
		{
			name: "Invalid quota source",
			req: dto.CreateTicketRequest{
				FirstName:   "John",
				LastName:    "Doe",
				Phone:       "12345678",
				TicketType:  models.TicketTypeSimple,
				SaleSource:  models.SaleSourceAnticipada,
				QuotaSource: "INVALID_QUOTA",
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
			name: "Missing both token and code",
			req: dto.ValidateTicketRequest{
				ValidationType: models.ValidationTypeEntrada,
			},
			wantErr: true,
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
			name: "Invalid 4 digit code too short",
			req: dto.ValidateTicketRequest{
				FourDigitCode:  "123",
				ValidationType: models.ValidationTypeEntrada,
			},
			wantErr: true,
		},
		{
			name: "Invalid validation type",
			req: dto.ValidateTicketRequest{
				FourDigitCode:  "1234",
				ValidationType: "UNKNOWN",
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

func TestUpdateTicketPriceRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     dto.UpdateTicketPriceRequest
		wantErr bool
	}{
		{
			name: "Valid price update",
			req: dto.UpdateTicketPriceRequest{
				TicketType: models.TicketTypeSimple,
				Price:      1500.50,
			},
			wantErr: false,
		},
		{
			name: "Invalid ticket type",
			req: dto.UpdateTicketPriceRequest{
				TicketType: "VIP",
				Price:      2000,
			},
			wantErr: true,
		},
		{
			name: "Negative price",
			req: dto.UpdateTicketPriceRequest{
				TicketType: models.TicketTypeSimple,
				Price:      -10,
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

func TestLoginRequest_Validate(t *testing.T) {
	req := dto.LoginRequest{Email: " USER@EXAMPLE.COM ", Password: "secretpassword"}
	if err := req.Validate(); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if req.Email != "user@example.com" {
		t.Errorf("Expected email to be sanitized, got %s", req.Email)
	}

	reqEmptyEmail := dto.LoginRequest{Email: "", Password: "pass"}
	if err := reqEmptyEmail.Validate(); err == nil {
		t.Errorf("Expected error for empty email")
	}

	reqEmptyPass := dto.LoginRequest{Email: "user@example.com", Password: ""}
	if err := reqEmptyPass.Validate(); err == nil {
		t.Errorf("Expected error for empty password")
	}
}

func TestGoogleAuthRequest_Validate(t *testing.T) {
	req := dto.GoogleAuthRequest{IDToken: "  token123  "}
	if err := req.Validate(); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
	if req.IDToken != "token123" {
		t.Errorf("Expected trimmed IDToken, got %s", req.IDToken)
	}

	reqEmpty := dto.GoogleAuthRequest{IDToken: "   "}
	if err := reqEmpty.Validate(); err == nil {
		t.Errorf("Expected error for empty token")
	}
}

func TestUpdateUserStatusRequest_Validate(t *testing.T) {
	statuses := []models.UserStatus{models.StatusPending, models.StatusActive, models.StatusDisabled}
	for _, status := range statuses {
		req := dto.UpdateUserStatusRequest{Status: status}
		if err := req.Validate(); err != nil {
			t.Errorf("Unexpected error for status %s: %v", status, err)
		}
	}

	reqInvalid := dto.UpdateUserStatusRequest{Status: "BANNED"}
	if err := reqInvalid.Validate(); err == nil {
		t.Errorf("Expected error for invalid user status")
	}
}

func TestUpdateUserRoleRequest_Validate(t *testing.T) {
	roles := []models.UserRole{models.RoleAdmin, models.RoleSeller}
	for _, role := range roles {
		req := dto.UpdateUserRoleRequest{Role: role}
		if err := req.Validate(); err != nil {
			t.Errorf("Unexpected error for role %s: %v", role, err)
		}
	}

	reqInvalid := dto.UpdateUserRoleRequest{Role: "SUPERADMIN"}
	if err := reqInvalid.Validate(); err == nil {
		t.Errorf("Expected error for invalid role")
	}
}

func TestUpdateQuotaRequest_Validate(t *testing.T) {
	validReq := dto.UpdateQuotaRequest{QuotaType: models.QuotaTypePersonal, AssignedQuota: 10}
	if err := validReq.Validate(); err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	negReq := dto.UpdateQuotaRequest{QuotaType: models.QuotaTypePersonal, AssignedQuota: -5}
	if err := negReq.Validate(); err == nil {
		t.Errorf("Expected error for negative quota")
	}

	invalidTypeReq := dto.UpdateQuotaRequest{QuotaType: "UNKNOWN", AssignedQuota: 5}
	if err := invalidTypeReq.Validate(); err == nil {
		t.Errorf("Expected error for invalid quota type")
	}
}

func TestUpdateDefaultQuotaRequest_Validate(t *testing.T) {
	validReq := dto.UpdateDefaultQuotaRequest{DefaultPersonalQuota: 50}
	if err := validReq.Validate(); err != nil {
		t.Errorf("Unexpected error: %v", err)
	}

	negReq := dto.UpdateDefaultQuotaRequest{DefaultPersonalQuota: -1}
	if err := negReq.Validate(); err == nil {
		t.Errorf("Expected error for negative default quota")
	}
}
