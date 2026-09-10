package services_test

import (
	"context"
	"testing"

	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/services"
)

func setupTicketServiceTest() (services.TicketService, *MockTicketRepository, *MockQuotaRepository, *MockPriceRepository, *MockUserRepository) {
	ticketRepo := NewMockTicketRepository()
	quotaRepo := NewMockQuotaRepository()
	priceRepo := NewMockPriceRepository()
	userRepo := NewMockUserRepository()

	// Seed default seller and operator users
	seller := &models.User{
		ID:     "seller-uuid-1",
		Name:   "Seller One",
		Email:  "seller1@example.com",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	operator := &models.User{
		ID:     "operator-uuid-1",
		Name:   "Operator One",
		Email:  "operator1@example.com",
		Role:   models.RoleSeller,
		Status: models.StatusActive,
	}
	admin := &models.User{
		ID:     "admin-uuid-1",
		Name:   "Admin One",
		Email:  "admin1@example.com",
		Role:   models.RoleAdmin,
		Status: models.StatusActive,
	}
	userRepo.Users[seller.ID] = seller
	userRepo.Users[operator.ID] = operator
	userRepo.Users[admin.ID] = admin

	// Seed quota for seller
	quotaRepo.SellerQuotas[seller.ID] = &models.SellerQuota{
		SellerID:      seller.ID,
		AssignedQuota: 20,
		UsedQuota:     0,
		UsedFreeQuota: 0,
	}

	svc := services.NewTicketService(ticketRepo, quotaRepo, priceRepo, userRepo)
	return svc, ticketRepo, quotaRepo, priceRepo, userRepo
}

func TestTicketService_CreateTicket_Success(t *testing.T) {
	svc, _, _, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	email := "buyer@example.com"
	req := &dto.CreateTicketRequest{
		TicketType:  models.TicketTypeSimple,
		SaleSource:  models.SaleSourceAnticipada,
		QuotaSource: models.QuotaSourcePersonal,
		FirstName:   "Juan",
		LastName:    "Perez",
		Phone:       "+54 9 11 1234 5678",
		Email:       &email,
	}

	resp, err := svc.CreateTicket(ctx, "seller-uuid-1", req)
	if err != nil {
		t.Fatalf("CreateTicket failed: %v", err)
	}

	if resp.ID == "" {
		t.Errorf("Expected ticket ID to be generated")
	}
	if resp.PricePaid != 1000.0 {
		t.Errorf("Expected price paid 1000.0, got %f", resp.PricePaid)
	}
	if resp.Status != models.TicketStatusVendido {
		t.Errorf("Expected initial status VENDIDO, got %s", resp.Status)
	}
}

func TestTicketService_CreateTicket_Failures(t *testing.T) {
	svc, ticketRepo, quotaRepo, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	// 1. Invalid request validation
	invalidReq := &dto.CreateTicketRequest{}
	_, err := svc.CreateTicket(ctx, "seller-uuid-1", invalidReq)
	if err == nil {
		t.Errorf("Expected error for invalid request")
	}

	// 2. Seller not found
	validReq := &dto.CreateTicketRequest{
		TicketType: models.TicketTypeSimple,
		SaleSource: models.SaleSourceAnticipada,
		FirstName:  "Maria",
		LastName:   "Gomez",
		Phone:      "1122334455",
	}
	_, err = svc.CreateTicket(ctx, "non-existent-seller", validReq)
	if err == nil {
		t.Errorf("Expected error for non-existent seller")
	}

	// 3. Quota Exhausted (Personal and Free)
	quotaRepo.SellerQuotas["seller-uuid-1"] = &models.SellerQuota{
		SellerID:      "seller-uuid-1",
		AssignedQuota: 5,
		UsedQuota:     5, // Personal Exhausted
	}
	quotaRepo.GlobalFree.TotalFreeQuota = 10
	quotaRepo.GlobalFree.UsedFreeQuota = 10 // Global Free Exhausted
	_, err = svc.CreateTicket(ctx, "seller-uuid-1", validReq)
	if err == nil {
		t.Errorf("Expected error when personal and free quotas are exhausted")
	}

	// 4. BeginTx failure
	ticketRepo.FailBeginTx = true
	quotaRepo.SellerQuotas["seller-uuid-1"].AssignedQuota = 10 // Reset quota
	quotaRepo.SellerQuotas["seller-uuid-1"].UsedQuota = 0
	_, err = svc.CreateTicket(ctx, "seller-uuid-1", validReq)
	if err == nil {
		t.Errorf("Expected error when BeginTx fails")
	}
}

func TestTicketService_ValidateTicket_StateTransitions(t *testing.T) {
	svc, ticketRepo, _, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	// Create initial ticket (CON_COMIDA)
	email := "buyer2@example.com"
	createReq := &dto.CreateTicketRequest{
		TicketType: models.TicketTypeConComida,
		SaleSource: models.SaleSourceAnticipada,
		FirstName:  "Carlos",
		LastName:   "Lopez",
		Phone:      "1122334455",
		Email:      &email,
	}

	created, err := svc.CreateTicket(ctx, "seller-uuid-1", createReq)
	if err != nil {
		t.Fatalf("Failed to create ticket for state transition test: %v", err)
	}

	// State Transition 1: VENDIDO + ENTRADA -> USADO_ENTRADA
	valReq1 := &dto.ValidateTicketRequest{
		PublicToken:    created.PublicToken,
		ValidationType: models.ValidationTypeEntrada,
	}
	resp1, err := svc.ValidateTicket(ctx, "operator-uuid-1", valReq1)
	if err != nil {
		t.Fatalf("Validation 1 (ENTRADA) failed: %v", err)
	}
	if resp1.Status != models.TicketStatusUsadoEntrada {
		t.Errorf("Expected status USADO_ENTRADA, got %s", resp1.Status)
	}

	// State Transition 2: Re-validating ENTRADA on USADO_ENTRADA ticket -> ERROR
	_, err = svc.ValidateTicket(ctx, "operator-uuid-1", valReq1)
	if err == nil {
		t.Errorf("Expected error when re-validating ENTRADA on already used entry")
	}

	// State Transition 3: USADO_ENTRADA + COMIDA -> USADO_COMIDA
	valReq2 := &dto.ValidateTicketRequest{
		PublicToken:    created.PublicToken,
		ValidationType: models.ValidationTypeComida,
	}
	resp2, err := svc.ValidateTicket(ctx, "operator-uuid-1", valReq2)
	if err != nil {
		t.Fatalf("Validation 2 (COMIDA) failed: %v", err)
	}
	if resp2.Status != models.TicketStatusUsadoComida {
		t.Errorf("Expected status USADO_COMIDA, got %s", resp2.Status)
	}

	// State Transition 4: Re-validating COMIDA on USADO_COMIDA ticket -> ERROR
	_, err = svc.ValidateTicket(ctx, "operator-uuid-1", valReq2)
	if err == nil {
		t.Errorf("Expected error when re-validating COMIDA on fully used ticket")
	}

	// State Transition 5: Annul fresh VENDIDO ticket -> ANULADO
	freshReq := &dto.CreateTicketRequest{
		TicketType: models.TicketTypeSimple,
		SaleSource: models.SaleSourcePuerta,
		FirstName:  "Pedro",
		LastName:   "Picapiedra",
		Phone:      "1133445566",
	}
	freshTicket, err := svc.CreateTicket(ctx, "seller-uuid-1", freshReq)
	if err != nil {
		t.Fatalf("Failed to create fresh ticket for annulment test: %v", err)
	}

	err = svc.AnnulTicket(ctx, "operator-uuid-1", freshTicket.ID, "Customer refund request")
	if err != nil {
		t.Fatalf("AnnulTicket failed: %v", err)
	}

	annulledTicket, _ := ticketRepo.GetByID(ctx, freshTicket.ID)
	if annulledTicket.Status != models.TicketStatusAnulado {
		t.Errorf("Expected status ANULADO, got %s", annulledTicket.Status)
	}

	// State Transition 6: Validate on ANULADO ticket -> ERROR
	valReqAnnulled := &dto.ValidateTicketRequest{
		PublicToken:    freshTicket.PublicToken,
		ValidationType: models.ValidationTypeEntrada,
	}
	_, err = svc.ValidateTicket(ctx, "operator-uuid-1", valReqAnnulled)
	if err == nil {
		t.Errorf("Expected error when validating an ANULADO ticket")
	}
}

func TestTicketService_ValidateBy4DigitCode(t *testing.T) {
	svc, _, _, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	createReq := &dto.CreateTicketRequest{
		TicketType: models.TicketTypeSimple,
		SaleSource: models.SaleSourcePuerta,
		FirstName:  "Ana",
		LastName:   "Rios",
		Phone:      "1199887766",
	}

	created, err := svc.CreateTicket(ctx, "seller-uuid-1", createReq)
	if err != nil {
		t.Fatalf("Failed to create ticket: %v", err)
	}

	valReq := &dto.ValidateTicketRequest{
		FourDigitCode:  created.FourDigitCode,
		ValidationType: models.ValidationTypeEntrada,
	}

	resp, err := svc.ValidateTicket(ctx, "operator-uuid-1", valReq)
	if err != nil {
		t.Fatalf("ValidateTicket by 4 digit code failed: %v", err)
	}
	if resp.ID != created.ID {
		t.Errorf("Expected ticket ID %s, got %s", created.ID, resp.ID)
	}
}

func TestTicketService_PricesAndList(t *testing.T) {
	svc, _, _, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	// Get active prices
	prices, err := svc.GetActivePrices(ctx)
	if err != nil || len(prices) == 0 {
		t.Fatalf("GetActivePrices failed: %v", err)
	}

	// Update price by non-admin -> Forbidden
	_, err = svc.UpdatePrice(ctx, "seller-uuid-1", &dto.UpdateTicketPriceRequest{
		TicketType: models.TicketTypeSimple,
		Price:      1200.0,
	})
	if err == nil {
		t.Errorf("Expected error when non-admin attempts price update")
	}

	// Update price by admin
	updated, err := svc.UpdatePrice(ctx, "admin-uuid-1", &dto.UpdateTicketPriceRequest{
		TicketType: models.TicketTypeSimple,
		Price:      1200.0,
	})
	if err != nil {
		t.Fatalf("UpdatePrice failed: %v", err)
	}
	if updated.Price != 1200.0 {
		t.Errorf("Expected updated price 1200.0, got %f", updated.Price)
	}

	// List tickets
	tickets, err := svc.ListTickets(ctx, "seller-uuid-1")
	if err != nil {
		t.Fatalf("ListTickets failed: %v", err)
	}
	if tickets == nil {
		// Empty slice initialized
	}
}

func TestTicketService_GetPublicTicket(t *testing.T) {
	svc, _, _, _, _ := setupTicketServiceTest()
	ctx := context.Background()

	createReq := &dto.CreateTicketRequest{
		TicketType: models.TicketTypeSimple,
		SaleSource: models.SaleSourceAnticipada,
		FirstName:  "Laura",
		LastName:   "Diaz",
		Phone:      "1144556677",
	}

	created, err := svc.CreateTicket(ctx, "seller-uuid-1", createReq)
	if err != nil {
		t.Fatalf("Failed to create ticket: %v", err)
	}

	pub, err := svc.GetPublicTicket(ctx, created.PublicToken)
	if err != nil {
		t.Fatalf("GetPublicTicket failed: %v", err)
	}

	if pub.PublicToken != created.PublicToken {
		t.Errorf("Expected public token %s, got %s", created.PublicToken, pub.PublicToken)
	}
	if pub.BuyerName != "Laura Diaz" {
		t.Errorf("Expected BuyerName 'Laura Diaz', got '%s'", pub.BuyerName)
	}

	_, err = svc.GetPublicTicket(ctx, "invalid-token")
	if err == nil {
		t.Errorf("Expected error for non-existent public token")
	}
}
