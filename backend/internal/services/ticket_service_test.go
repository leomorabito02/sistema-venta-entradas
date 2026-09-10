package services

import (
	"context"
	"database/sql"
	"sync"
	"testing"

	"backend/internal/dto"
	"backend/internal/models"
)

type mockTicketRepo struct {
	mu      sync.Mutex
	tickets map[string]*models.Ticket
}

func newMockTicketRepo() *mockTicketRepo {
	return &mockTicketRepo{
		tickets: make(map[string]*models.Ticket),
	}
}

func (m *mockTicketRepo) BeginTx(ctx context.Context) (*sql.Tx, error) {
	return nil, nil
}

func (m *mockTicketRepo) CreateBuyer(ctx context.Context, buyer *models.Buyer) error {
	buyer.ID = "buyer-1"
	return nil
}

func (m *mockTicketRepo) CreateBuyerTx(ctx context.Context, tx *sql.Tx, buyer *models.Buyer) error {
	buyer.ID = "buyer-1"
	return nil
}

func (m *mockTicketRepo) CreateTicketTx(ctx context.Context, tx *sql.Tx, ticket *models.Ticket) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	ticket.ID = "ticket-1"
	m.tickets[ticket.ID] = ticket
	return nil
}

func (m *mockTicketRepo) GetByID(ctx context.Context, id string) (*models.Ticket, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	t, exists := m.tickets[id]
	if !exists {
		return nil, sql.ErrNoRows
	}
	return t, nil
}

func (m *mockTicketRepo) GetByIDTx(ctx context.Context, tx *sql.Tx, id string) (*models.Ticket, error) {
	return m.GetByID(ctx, id)
}

func (m *mockTicketRepo) GetByPublicToken(ctx context.Context, token string) (*models.Ticket, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, t := range m.tickets {
		if t.PublicToken == token {
			return t, nil
		}
	}
	return nil, sql.ErrNoRows
}

func (m *mockTicketRepo) GetByPublicTokenTx(ctx context.Context, tx *sql.Tx, token string) (*models.Ticket, error) {
	return m.GetByPublicToken(ctx, token)
}

func (m *mockTicketRepo) GetBy4DigitCode(ctx context.Context, code string) (*models.Ticket, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, t := range m.tickets {
		if t.FourDigitCode == code {
			return t, nil
		}
	}
	return nil, sql.ErrNoRows
}

func (m *mockTicketRepo) GetBy4DigitCodeTx(ctx context.Context, tx *sql.Tx, code string) (*models.Ticket, error) {
	return m.GetBy4DigitCode(ctx, code)
}

func (m *mockTicketRepo) Is4DigitCodeExists(ctx context.Context, code string) (bool, error) {
	return false, nil
}

func (m *mockTicketRepo) UpdateStatusTx(ctx context.Context, tx *sql.Tx, ticketID string, status models.TicketStatus) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if t, ok := m.tickets[ticketID]; ok {
		t.Status = status
	}
	return nil
}

func (m *mockTicketRepo) RecordValidationTx(ctx context.Context, tx *sql.Tx, val *models.TicketValidation) error {
	return nil
}

func (m *mockTicketRepo) ListTickets(ctx context.Context, sellerID string) ([]*models.Ticket, error) {
	return nil, nil
}

type dummyQuotaRepo struct{}

func (d *dummyQuotaRepo) GetSellerQuota(ctx context.Context, sellerID string) (*models.SellerQuota, error) {
	return &models.SellerQuota{}, nil
}
func (d *dummyQuotaRepo) GetGlobalFreeQuota(ctx context.Context) (*models.GlobalFreeQuota, error) {
	return &models.GlobalFreeQuota{}, nil
}
func (d *dummyQuotaRepo) DeductPresaleQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, preferredSource models.QuotaSource) (models.QuotaSource, error) {
	if preferredSource == models.QuotaSourceLibre {
		return models.QuotaSourceLibre, nil
	}
	return models.QuotaSourcePersonal, nil
}
func (d *dummyQuotaRepo) RestoreQuotaTx(ctx context.Context, tx *sql.Tx, sellerID string, quotaSource models.QuotaSource) error {
	return nil
}
func (d *dummyQuotaRepo) SetSellerQuota(ctx context.Context, adminID string, sellerID string, assigned int) error {
	return nil
}
func (d *dummyQuotaRepo) SetAllSellersPersonalQuota(ctx context.Context, adminID string, assigned int) error {
	return nil
}
func (d *dummyQuotaRepo) SetGlobalFreeQuota(ctx context.Context, adminID string, totalFree int) error {
	return nil
}
func (d *dummyQuotaRepo) GetDefaultQuotaConfig(ctx context.Context) (int, error) {
	return 0, nil
}
func (d *dummyQuotaRepo) GetAllSellersQuotas(ctx context.Context) ([]*models.SellerQuotaDetail, error) {
	return nil, nil
}
func (d *dummyQuotaRepo) GetFreeQuotaUsageBySeller(ctx context.Context) ([]*models.SellerFreeQuotaUsage, error) {
	return nil, nil
}

type dummyPriceRepo struct{}

func (d *dummyPriceRepo) GetActivePrice(ctx context.Context, ticketType models.TicketType) (float64, error) {
	return 3000.0, nil
}
func (d *dummyPriceRepo) SetActivePrice(ctx context.Context, ticketType models.TicketType, price float64) error {
	return nil
}
func (d *dummyPriceRepo) GetAllActivePrices(ctx context.Context) (map[models.TicketType]float64, error) {
	return nil, nil
}

type dummyUserRepo struct{}

func (d *dummyUserRepo) Create(ctx context.Context, user *models.User) error { return nil }
func (d *dummyUserRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	return &models.User{ID: id, Name: "Seller 1", Role: models.RoleSeller}, nil
}
func (d *dummyUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	return nil, nil
}
func (d *dummyUserRepo) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	return nil, nil
}
func (d *dummyUserRepo) UpsertGoogleUser(ctx context.Context, email, name, googleID string) (*models.User, bool, error) {
	return nil, false, nil
}
func (d *dummyUserRepo) Update(ctx context.Context, user *models.User) error { return nil }
func (d *dummyUserRepo) List(ctx context.Context) ([]*models.User, error)     { return nil, nil }
func (d *dummyUserRepo) SeedInitialAdmin(ctx context.Context, email, name string) error {
	return nil
}

func TestConcurrentValidationRaceCondition(t *testing.T) {
	mockRepo := newMockTicketRepo()
	mockRepo.tickets["ticket-100"] = &models.Ticket{
		ID:            "ticket-100",
		PublicToken:   "token-100",
		FourDigitCode: "1234",
		TicketType:    models.TicketTypeSimple,
		Status:        models.TicketStatusVendido,
		Buyer:         &models.Buyer{FirstName: "Juan", LastName: "Perez"},
		Seller:        &models.User{Name: "Vendedor"},
	}

	service := NewTicketService(mockRepo, &dummyQuotaRepo{}, &dummyPriceRepo{}, &dummyUserRepo{})

	req := &dto.ValidateTicketRequest{
		PublicToken:    "token-100",
		ValidationType: models.ValidationTypeEntrada,
	}

	const goroutines = 10
	var wg sync.WaitGroup
	successCount := 0
	conflictCount := 0
	var countMu sync.Mutex

	wg.Add(goroutines)
	for i := 0; i < goroutines; i++ {
		go func() {
			defer wg.Done()
			_, err := service.ValidateTicket(context.Background(), "op-1", req)
			countMu.Lock()
			defer countMu.Unlock()
			if err == nil {
				successCount++
			} else {
				conflictCount++
			}
		}()
	}

	wg.Wait()

	if successCount != 1 {
		t.Errorf("Expected exactly 1 success validation, got %d", successCount)
	}

	if conflictCount != goroutines-1 {
		t.Errorf("Expected %d conflict errors, got %d", goroutines-1, conflictCount)
	}
}
