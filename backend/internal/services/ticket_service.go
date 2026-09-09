package services

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"math/big"
	"net/http"

	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/repository"
)

const (
	errFailedToBeginTx = "Failed to begin transaction"
)

type TicketService interface {
	CreateTicket(ctx context.Context, sellerID string, req *dto.CreateTicketRequest) (*dto.TicketResponse, error)
	GetPublicTicket(ctx context.Context, token string) (*dto.TicketPublicResponse, error)
	ValidateTicket(ctx context.Context, operatorID string, req *dto.ValidateTicketRequest) (*dto.TicketResponse, error)
	AnnulTicket(ctx context.Context, operatorID string, ticketID string, reason string) error
	GetActivePrices(ctx context.Context) ([]*dto.TicketPriceResponse, error)
	UpdatePrice(ctx context.Context, adminID string, req *dto.UpdateTicketPriceRequest) (*dto.TicketPriceResponse, error)
	ListTickets(ctx context.Context, sellerID string) ([]*dto.TicketResponse, error)
}

type ticketService struct {
	ticketRepo repository.TicketRepository
	quotaRepo  repository.QuotaRepository
	priceRepo  repository.PriceRepository
	userRepo   repository.UserRepository
}

func NewTicketService(
	ticketRepo repository.TicketRepository,
	quotaRepo repository.QuotaRepository,
	priceRepo repository.PriceRepository,
	userRepo repository.UserRepository,
) TicketService {
	return &ticketService{
		ticketRepo: ticketRepo,
		quotaRepo:  quotaRepo,
		priceRepo:  priceRepo,
		userRepo:   userRepo,
	}
}

func (s *ticketService) CreateTicket(ctx context.Context, sellerID string, req *dto.CreateTicketRequest) (*dto.TicketResponse, error) {
	// Validate input
	if err := req.Validate(); err != nil {
		return nil, models.NewBadRequestError("Invalid request payload", err)
	}

	seller, err := s.userRepo.GetByID(ctx, sellerID)
	if err != nil {
		return nil, models.NewNotFoundError("Seller not found", err)
	}

	pricePaid, err := s.priceRepo.GetActivePrice(ctx, req.TicketType)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch ticket price", err)
	}

	publicToken, err := generateRandomToken(32)
	if err != nil {
		return nil, models.NewInternalError("Failed to generate public token", err)
	}

	fourDigitCode, err := s.generateUnique4DigitCode(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to generate unique 4-digit code", err)
	}

	tx, err := s.ticketRepo.BeginTx(ctx)
	if err != nil {
		return nil, models.NewInternalError(errFailedToBeginTx, err)
	}
	if tx != nil {
		defer tx.Rollback()
	}

	buyer := &models.Buyer{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		Email:     req.Email,
	}
	if err := s.ticketRepo.CreateBuyerTx(ctx, tx, buyer); err != nil {
		return nil, models.NewInternalError("Failed to create buyer record", err)
	}

	var quotaSource *models.QuotaSource
	if req.SaleSource == models.SaleSourceAnticipada {
		qs, err := s.quotaRepo.DeductPresaleQuotaTx(ctx, tx, sellerID)
		if err != nil {
			return nil, models.NewConflictError("Presale ticket quota exhausted", err)
		}
		quotaSource = &qs
	}

	ticket := &models.Ticket{
		PublicToken:   publicToken,
		FourDigitCode: fourDigitCode,
		TicketType:    req.TicketType,
		SaleSource:    req.SaleSource,
		QuotaSource:   quotaSource,
		PricePaid:     pricePaid,
		Status:        models.TicketStatusVendido,
		BuyerID:       buyer.ID,
		SellerID:      sellerID,
	}

	if err := s.ticketRepo.CreateTicketTx(ctx, tx, ticket); err != nil {
		return nil, models.NewInternalError("Failed to create ticket record", err)
	}

	if tx != nil {
		if err := tx.Commit(); err != nil {
			return nil, models.NewInternalError("Failed to commit ticket transaction", err)
		}
	}

	ticket.Buyer = buyer
	ticket.Seller = seller
	return s.toTicketResponse(ticket), nil
}

func (s *ticketService) GetPublicTicket(ctx context.Context, token string) (*dto.TicketPublicResponse, error) {
	if token == "" {
		return nil, models.NewBadRequestError("Public token is required", nil)
	}

	ticket, err := s.ticketRepo.GetByPublicToken(ctx, token)
	if err != nil {
		return nil, models.NewNotFoundError("Ticket not found", err)
	}

	includesFood := ticket.TicketType == models.TicketTypeConComida
	buyerName := fmt.Sprintf("%s %s", ticket.Buyer.FirstName, ticket.Buyer.LastName)

	return &dto.TicketPublicResponse{
		TicketNumber:  ticket.TicketNumber,
		FourDigitCode: ticket.FourDigitCode,
		PublicToken:   ticket.PublicToken,
		TicketType:    ticket.TicketType,
		SaleSource:    ticket.SaleSource,
		Status:        ticket.Status,
		PricePaid:     ticket.PricePaid,
		BuyerName:     buyerName,
		SellerName:    ticket.Seller.Name,
		IncludesFood:  includesFood,
		CreatedAt:     ticket.CreatedAt,
	}, nil
}

func (s *ticketService) ValidateTicket(ctx context.Context, operatorID string, req *dto.ValidateTicketRequest) (*dto.TicketResponse, error) {
	if err := req.Validate(); err != nil {
		return nil, models.NewBadRequestError("Invalid request payload", err)
	}

	tx, err := s.ticketRepo.BeginTx(ctx)
	if err != nil {
		return nil, models.NewInternalError(errFailedToBeginTx, err)
	}
	if tx != nil {
		defer tx.Rollback()
	}

	ticket, err := s.getTicketForValidationTx(ctx, tx, req)
	if err != nil {
		return nil, models.NewNotFoundError("Ticket not found or inactive", err)
	}

	prevStatus := ticket.Status
	nextStatus, err := determineNextStatus(ticket, req.ValidationType)
	if err != nil {
		return nil, err
	}

	if err := s.ticketRepo.UpdateStatusTx(ctx, tx, ticket.ID, nextStatus); err != nil {
		return nil, models.NewInternalError("Failed to update ticket status", err)
	}

	validation := &models.TicketValidation{
		TicketID:       ticket.ID,
		ValidationType: req.ValidationType,
		ValidatedBy:    operatorID,
		PreviousStatus: prevStatus,
		NewStatus:      nextStatus,
	}
	if err := s.ticketRepo.RecordValidationTx(ctx, tx, validation); err != nil {
		return nil, models.NewInternalError("Failed to record validation log", err)
	}

	if tx != nil {
		if err := tx.Commit(); err != nil {
			return nil, models.NewInternalError("Failed to commit validation transaction", err)
		}
	}

	ticket.Status = nextStatus
	return s.toTicketResponse(ticket), nil
}

func (s *ticketService) getTicketForValidationTx(ctx context.Context, tx *sql.Tx, req *dto.ValidateTicketRequest) (*models.Ticket, error) {
	if req.PublicToken != "" {
		return s.ticketRepo.GetByPublicTokenTx(ctx, tx, req.PublicToken)
	} else if req.FourDigitCode != "" {
		return s.ticketRepo.GetBy4DigitCodeTx(ctx, tx, req.FourDigitCode)
	}
	return nil, fmt.Errorf("no validation identifier provided")
}

func determineNextStatus(ticket *models.Ticket, vType models.ValidationType) (models.TicketStatus, error) {
	if ticket.Status == models.TicketStatusAnulado {
		return "", models.NewAppError(http.StatusUnprocessableEntity, "TICKET_ANNULLED", "Ticket is annulled and cannot be used", models.ErrTicketAnnulled)
	}

	switch vType {
	case models.ValidationTypeEntrada:
		if ticket.Status != models.TicketStatusVendido {
			return "", models.NewConflictError(fmt.Sprintf("Entry ticket already used or invalid state: %s", ticket.Status), models.ErrInvalidStatusTransition)
		}
		return models.TicketStatusUsadoEntrada, nil

	case models.ValidationTypeComida:
		if ticket.TicketType != models.TicketTypeConComida {
			return "", models.NewBadRequestError("Ticket does not include food benefit", nil)
		}
		if ticket.Status != models.TicketStatusUsadoEntrada {
			return "", models.NewConflictError("Entry check-in must be validated before collecting food", models.ErrInvalidStatusTransition)
		}
		return models.TicketStatusUsadoComida, nil
	}

	return "", models.NewBadRequestError("Unknown validation type", nil)
}

func (s *ticketService) AnnulTicket(ctx context.Context, operatorID string, ticketID string, reason string) error {
	if ticketID == "" {
		return models.NewBadRequestError("Ticket ID is required", nil)
	}

	tx, err := s.ticketRepo.BeginTx(ctx)
	if err != nil {
		return models.NewInternalError(errFailedToBeginTx, err)
	}
	if tx != nil {
		defer tx.Rollback()
	}

	ticket, err := s.ticketRepo.GetByIDTx(ctx, tx, ticketID)
	if err != nil {
		return models.NewNotFoundError("Ticket not found", err)
	}

	if ticket.Status == models.TicketStatusAnulado {
		return models.NewConflictError("Ticket is already annulled", nil)
	}

	prevStatus := ticket.Status
	nextStatus := models.TicketStatusAnulado

	if err := s.ticketRepo.UpdateStatusTx(ctx, tx, ticket.ID, nextStatus); err != nil {
		return models.NewInternalError("Failed to update ticket status to ANULADO", err)
	}

	if ticket.SaleSource == models.SaleSourceAnticipada && prevStatus != models.TicketStatusAnulado && ticket.QuotaSource != nil {
		if err := s.quotaRepo.RestoreQuotaTx(ctx, tx, ticket.SellerID, *ticket.QuotaSource); err != nil {
			return models.NewInternalError("Failed to restore ticket quota", err)
		}
	}

	validation := &models.TicketValidation{
		TicketID:       ticket.ID,
		ValidationType: models.ValidationTypeAnulacion,
		ValidatedBy:    operatorID,
		PreviousStatus: prevStatus,
		NewStatus:      nextStatus,
		Notes:          &reason,
	}
	if err := s.ticketRepo.RecordValidationTx(ctx, tx, validation); err != nil {
		return models.NewInternalError("Failed to record annulment log", err)
	}

	if tx != nil {
		return tx.Commit()
	}
	return nil
}

func (s *ticketService) toTicketResponse(t *models.Ticket) *dto.TicketResponse {
	res := &dto.TicketResponse{
		ID:            t.ID,
		TicketNumber:  t.TicketNumber,
		PublicToken:   t.PublicToken,
		PublicURL:     fmt.Sprintf("/api/tickets/public/%s", t.PublicToken),
		FourDigitCode: t.FourDigitCode,
		TicketType:    t.TicketType,
		SaleSource:    t.SaleSource,
		QuotaSource:   t.QuotaSource,
		PricePaid:     t.PricePaid,
		Status:        t.Status,
		Buyer:         t.Buyer,
		SellerID:      t.SellerID,
		CreatedAt:     t.CreatedAt,
	}
	if t.Seller != nil {
		res.Seller = &dto.UserResponse{
			ID:     t.Seller.ID,
			Email:  t.Seller.Email,
			Name:   t.Seller.Name,
			Role:   t.Seller.Role,
			Status: t.Seller.Status,
		}
	}
	return res
}

func generateRandomToken(nBytes int) (string, error) {
	b := make([]byte, nBytes)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func generate4DigitCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(10000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%04d", n.Int64()), nil
}

func (s *ticketService) generateUnique4DigitCode(ctx context.Context) (string, error) {
	for i := 0; i < 100; i++ {
		code, err := generate4DigitCode()
		if err != nil {
			return "", err
		}
		exists, err := s.ticketRepo.Is4DigitCodeExists(ctx, code)
		if err != nil {
			return "", err
		}
		if !exists {
			return code, nil
		}
	}
	return "", fmt.Errorf("failed to generate unique 4-digit code after 100 attempts")
}

func (s *ticketService) GetActivePrices(ctx context.Context) ([]*dto.TicketPriceResponse, error) {
	pricesMap, err := s.priceRepo.GetAllActivePrices(ctx)
	if err != nil {
		return nil, models.NewInternalError("Failed to fetch active prices", err)
	}

	result := []*dto.TicketPriceResponse{
		{TicketType: models.TicketTypeSimple, Price: pricesMap[models.TicketTypeSimple]},
		{TicketType: models.TicketTypeConComida, Price: pricesMap[models.TicketTypeConComida]},
	}
	return result, nil
}

func (s *ticketService) UpdatePrice(ctx context.Context, adminID string, req *dto.UpdateTicketPriceRequest) (*dto.TicketPriceResponse, error) {
	if err := req.Validate(); err != nil {
		return nil, models.NewBadRequestError("Invalid price update request", err)
	}

	admin, err := s.userRepo.GetByID(ctx, adminID)
	if err != nil {
		return nil, models.NewNotFoundError("Admin user not found", err)
	}

	if admin.Role != models.RoleAdmin {
		return nil, models.NewForbiddenError("Only administrators can update ticket prices", models.ErrForbidden)
	}

	if err := s.priceRepo.SetActivePrice(ctx, req.TicketType, req.Price); err != nil {
		return nil, models.NewInternalError("Failed to set active ticket price", err)
	}

	return &dto.TicketPriceResponse{
		TicketType: req.TicketType,
		Price:      req.Price,
	}, nil
}

func (s *ticketService) ListTickets(ctx context.Context, sellerID string) ([]*dto.TicketResponse, error) {
	tickets, err := s.ticketRepo.ListTickets(ctx, sellerID)
	if err != nil {
		return nil, models.NewInternalError("Failed to list tickets", err)
	}

	var response []*dto.TicketResponse
	for _, t := range tickets {
		response = append(response, s.toTicketResponse(t))
	}
	return response, nil
}

