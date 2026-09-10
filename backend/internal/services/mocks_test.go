package services_test

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"backend/internal/models"
	"backend/internal/repository"
)

// MockUserRepository implements repository.UserRepository
type MockUserRepository struct {
	Users map[string]*models.User
}

func NewMockUserRepository() *MockUserRepository {
	return &MockUserRepository{
		Users: make(map[string]*models.User),
	}
}

func (m *MockUserRepository) Create(ctx context.Context, u *models.User) error {
	u.ID = "user-created-id"
	m.Users[u.ID] = u
	return nil
}

func (m *MockUserRepository) GetByID(ctx context.Context, id string) (*models.User, error) {
	u, ok := m.Users[id]
	if !ok {
		return nil, models.ErrNotFound
	}
	return u, nil
}

func (m *MockUserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, models.ErrNotFound
}

func (m *MockUserRepository) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	for _, u := range m.Users {
		if u.GoogleID != nil && *u.GoogleID == googleID {
			return u, nil
		}
	}
	return nil, models.ErrNotFound
}

func (m *MockUserRepository) UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return u, false, nil
		}
	}
	newU := &models.User{
		ID:       "new-user-uuid",
		Email:    email,
		Name:     name,
		Role:     models.RoleSeller,
		Status:   models.StatusPending,
		GoogleID: &googleID,
	}
	m.Users[newU.ID] = newU
	return newU, true, nil
}

func (m *MockUserRepository) Update(ctx context.Context, user *models.User) error {
	m.Users[user.ID] = user
	return nil
}

func (m *MockUserRepository) List(ctx context.Context) ([]*models.User, error) {
	list := make([]*models.User, 0, len(m.Users))
	for _, u := range m.Users {
		list = append(list, u)
	}
	return list, nil
}

func (m *MockUserRepository) SeedInitialAdmin(ctx context.Context, email, name string) error {
	return nil
}

// MockTokenRepository implements repository.TokenRepository
type MockTokenRepository struct {
	Tokens map[string]*models.RefreshToken
}

func NewMockTokenRepository() *MockTokenRepository {
	return &MockTokenRepository{
		Tokens: make(map[string]*models.RefreshToken),
	}
}

func (m *MockTokenRepository) CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error {
	m.Tokens[token.TokenHash] = token
	return nil
}

func (m *MockTokenRepository) GetByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error) {
	t, ok := m.Tokens[tokenHash]
	if !ok {
		return nil, models.ErrNotFound
	}
	return t, nil
}

func (m *MockTokenRepository) RevokeToken(ctx context.Context, tokenHash string) error {
	t, ok := m.Tokens[tokenHash]
	if ok {
		now := time.Now()
		t.RevokedAt = &now
	}
	return nil
}

func (m *MockTokenRepository) RevokeAllUserTokens(ctx context.Context, userID string) error {
	now := time.Now()
	for _, t := range m.Tokens {
		if t.UserID == userID {
			t.RevokedAt = &now
		}
	}
	return nil
}

// MockQuotaRepository implements repository.QuotaRepository
type MockQuotaRepository struct {
	SellerQuotas map[string]*models.SellerQuota
	GlobalFree   *models.GlobalFreeQuota
	DefaultQuota int
}

func NewMockQuotaRepository() *MockQuotaRepository {
	return &MockQuotaRepository{
		SellerQuotas: make(map[string]*models.SellerQuota),
		GlobalFree:   &models.GlobalFreeQuota{ID: 1, TotalFreeQuota: 100, UsedFreeQuota: 10},
		DefaultQuota: 20,
	}
}

func (m *MockQuotaRepository) GetSellerQuota(ctx context.Context, sellerID string) (*models.SellerQuota, error) {
	q, ok := m.SellerQuotas[sellerID]
	if !ok {
		return &models.SellerQuota{SellerID: sellerID, AssignedQuota: 10, UsedQuota: 0, UsedFreeQuota: 0}, nil
	}
	return q, nil
}

func (m *MockQuotaRepository) GetGlobalFreeQuota(ctx context.Context) (*models.GlobalFreeQuota, error) {
	return m.GlobalFree, nil
}

func (m *MockQuotaRepository) DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, preferredSource models.QuotaSource) (models.QuotaSource, error) {
	q, ok := m.SellerQuotas[sellerID]
	if !ok {
		return "", models.ErrNotFound
	}
	if preferredSource == models.QuotaSourcePersonal || preferredSource == "" {
		if q.AssignedQuota-q.UsedQuota > 0 {
			q.UsedQuota++
			return models.QuotaSourcePersonal, nil
		}
	}
	if m.GlobalFree.TotalFreeQuota-m.GlobalFree.UsedFreeQuota > 0 {
		m.GlobalFree.UsedFreeQuota++
		q.UsedFreeQuota++
		return models.QuotaSourceLibre, nil
	}
	return "", models.ErrQuotaExhausted
}

func (m *MockQuotaRepository) RestoreQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, quotaSource models.QuotaSource) error {
	q, ok := m.SellerQuotas[sellerID]
	if !ok {
		return nil
	}
	if quotaSource == models.QuotaSourcePersonal && q.UsedQuota > 0 {
		q.UsedQuota--
	} else if quotaSource == models.QuotaSourceLibre && q.UsedFreeQuota > 0 {
		q.UsedFreeQuota--
		if m.GlobalFree.UsedFreeQuota > 0 {
			m.GlobalFree.UsedFreeQuota--
		}
	}
	return nil
}

func (m *MockQuotaRepository) SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	q, ok := m.SellerQuotas[sellerID]
	if !ok {
		q = &models.SellerQuota{SellerID: sellerID}
		m.SellerQuotas[sellerID] = q
	}
	q.AssignedQuota = assigned
	return nil
}

func (m *MockQuotaRepository) SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error {
	for _, q := range m.SellerQuotas {
		q.AssignedQuota = assigned
	}
	return nil
}

func (m *MockQuotaRepository) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	m.GlobalFree.TotalFreeQuota = totalFree
	return nil
}

func (m *MockQuotaRepository) GetDefaultQuotaConfig(ctx context.Context) (int, error) {
	return m.DefaultQuota, nil
}

func (m *MockQuotaRepository) GetAllSellersQuotas(ctx context.Context) ([]*models.SellerQuotaDetail, error) {
	return nil, nil
}

func (m *MockQuotaRepository) GetFreeQuotaUsageBySeller(ctx context.Context) ([]*models.SellerFreeQuotaUsage, error) {
	return nil, nil
}

// MockPriceRepository implements repository.PriceRepository
type MockPriceRepository struct {
	Prices map[models.TicketType]float64
}

func NewMockPriceRepository() *MockPriceRepository {
	return &MockPriceRepository{
		Prices: map[models.TicketType]float64{
			models.TicketTypeSimple:    1000.0,
			models.TicketTypeConComida: 1500.0,
		},
	}
}

func (m *MockPriceRepository) GetActivePrice(ctx context.Context, ticketType models.TicketType) (float64, error) {
	p, ok := m.Prices[ticketType]
	if !ok {
		return 0, models.ErrNotFound
	}
	return p, nil
}

func (m *MockPriceRepository) SetActivePrice(ctx context.Context, ticketType models.TicketType, price float64) error {
	m.Prices[ticketType] = price
	return nil
}

func (m *MockPriceRepository) GetAllActivePrices(ctx context.Context) (map[models.TicketType]float64, error) {
	return m.Prices, nil
}

// MockTicketRepository implements repository.TicketRepository
type MockTicketRepository struct {
	Tickets         map[string]*models.Ticket
	Validations     []*models.TicketValidation
	ExistingCodes   map[string]bool
	FailBeginTx     bool
	FailCreateBuyer bool
}

func NewMockTicketRepository() *MockTicketRepository {
	return &MockTicketRepository{
		Tickets:       make(map[string]*models.Ticket),
		Validations:   make([]*models.TicketValidation, 0),
		ExistingCodes: make(map[string]bool),
	}
}

func (m *MockTicketRepository) BeginTx(ctx context.Context) (*sql.Tx, error) {
	if m.FailBeginTx {
		return nil, errors.New("tx error")
	}
	return nil, nil
}

func (m *MockTicketRepository) CreateBuyer(ctx context.Context, buyer *models.Buyer) error {
	if m.FailCreateBuyer {
		return errors.New("buyer error")
	}
	buyer.ID = "buyer-uuid-123"
	return nil
}

func (m *MockTicketRepository) CreateBuyerTx(ctx context.Context, tx *sql.Tx, buyer *models.Buyer) error {
	return m.CreateBuyer(ctx, buyer)
}

func (m *MockTicketRepository) CreateTicketTx(ctx context.Context, tx *sql.Tx, ticket *models.Ticket) error {
	ticket.ID = "ticket-uuid-" + ticket.FourDigitCode
	m.Tickets[ticket.ID] = ticket
	m.ExistingCodes[ticket.FourDigitCode] = true
	return nil
}

func (m *MockTicketRepository) GetByID(ctx context.Context, id string) (*models.Ticket, error) {
	t, ok := m.Tickets[id]
	if !ok {
		return nil, models.ErrNotFound
	}
	return t, nil
}

func (m *MockTicketRepository) GetByIDTx(ctx context.Context, tx *sql.Tx, id string) (*models.Ticket, error) {
	return m.GetByID(ctx, id)
}

func (m *MockTicketRepository) GetByPublicToken(ctx context.Context, token string) (*models.Ticket, error) {
	for _, t := range m.Tickets {
		if t.PublicToken == token {
			return t, nil
		}
	}
	return nil, models.ErrNotFound
}

func (m *MockTicketRepository) GetByPublicTokenTx(ctx context.Context, tx *sql.Tx, token string) (*models.Ticket, error) {
	return m.GetByPublicToken(ctx, token)
}

func (m *MockTicketRepository) GetBy4DigitCode(ctx context.Context, code string) (*models.Ticket, error) {
	for _, t := range m.Tickets {
		if t.FourDigitCode == code {
			return t, nil
		}
	}
	return nil, models.ErrNotFound
}

func (m *MockTicketRepository) GetBy4DigitCodeTx(ctx context.Context, tx *sql.Tx, code string) (*models.Ticket, error) {
	return m.GetBy4DigitCode(ctx, code)
}

func (m *MockTicketRepository) Is4DigitCodeExists(ctx context.Context, code string) (bool, error) {
	return m.ExistingCodes[code], nil
}

func (m *MockTicketRepository) UpdateStatusTx(ctx context.Context, tx *sql.Tx, ticketID string, status models.TicketStatus) error {
	t, ok := m.Tickets[ticketID]
	if !ok {
		return models.ErrNotFound
	}
	t.Status = status
	return nil
}

func (m *MockTicketRepository) RecordValidationTx(ctx context.Context, tx *sql.Tx, val *models.TicketValidation) error {
	m.Validations = append(m.Validations, val)
	return nil
}

func (m *MockTicketRepository) ListTickets(ctx context.Context, sellerID string) ([]*models.Ticket, error) {
	list := []*models.Ticket{}
	for _, t := range m.Tickets {
		if sellerID == "" || t.SellerID == sellerID {
			list = append(list, t)
		}
	}
	return list, nil
}

var _ repository.UserRepository = (*MockUserRepository)(nil)
var _ repository.TokenRepository = (*MockTokenRepository)(nil)
var _ repository.QuotaRepository = (*MockQuotaRepository)(nil)
var _ repository.PriceRepository = (*MockPriceRepository)(nil)
var _ repository.TicketRepository = (*MockTicketRepository)(nil)
