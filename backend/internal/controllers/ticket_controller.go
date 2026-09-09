package controllers

import (
	"encoding/json"
	"net/http"

	"backend/internal/dto"
	"backend/internal/middlewares"
	"backend/internal/models"
	"backend/internal/services"
	"backend/internal/views"
)

const (
	headerXUserID   = "X-User-ID"
	errAuthRequired = "User authentication required"
)

type TicketController struct {
	ticketService services.TicketService
	jsonView      *views.JSONView
}

func NewTicketController(ticketService services.TicketService, jsonView *views.JSONView) *TicketController {
	return &TicketController{
		ticketService: ticketService,
		jsonView:      jsonView,
	}
}

func (c *TicketController) CreateTicket(w http.ResponseWriter, r *http.Request) {
	sellerID := ""
	if user, ok := middlewares.GetUserFromContext(r.Context()); ok && user != nil {
		sellerID = user.ID
	} else {
		sellerID = r.Header.Get(headerXUserID)
	}

	if sellerID == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, errAuthRequired, nil)
		return
	}

	var req dto.CreateTicketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	ticket, err := c.ticketService.CreateTicket(r.Context(), sellerID, &req)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Ticket created successfully", ticket)
}

func (c *TicketController) ListTickets(w http.ResponseWriter, r *http.Request) {
	// If seller_id is provided in query, use it to filter, but require Admin if it's not the caller's ID
	sellerIDFilter := r.URL.Query().Get("seller_id")

	callerID := ""
	isAdmin := false
	if user, ok := middlewares.GetUserFromContext(r.Context()); ok && user != nil {
		callerID = user.ID
		isAdmin = user.Role == models.RoleAdmin
	} else {
		callerID = r.Header.Get(headerXUserID)
	}

	if callerID == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, errAuthRequired, nil)
		return
	}

	// Non-admin can only see their own tickets
	if !isAdmin {
		sellerIDFilter = callerID
	}

	tickets, err := c.ticketService.ListTickets(r.Context(), sellerIDFilter)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Tickets retrieved successfully", tickets)
}

func (c *TicketController) GetPublicTicket(w http.ResponseWriter, r *http.Request) {
	token := r.PathValue("token")
	if token == "" {
		c.jsonView.Error(w, http.StatusBadRequest, "Public token path parameter is required", nil)
		return
	}

	publicTicket, err := c.ticketService.GetPublicTicket(r.Context(), token)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Public ticket retrieved successfully", publicTicket)
}

func (c *TicketController) ValidateTicket(w http.ResponseWriter, r *http.Request) {
	operatorID := ""
	if user, ok := middlewares.GetUserFromContext(r.Context()); ok && user != nil {
		operatorID = user.ID
	} else {
		operatorID = r.Header.Get(headerXUserID)
	}

	if operatorID == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, errAuthRequired, nil)
		return
	}

	var req dto.ValidateTicketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	if err := req.Validate(); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, err.Error(), err)
		return
	}

	ticket, err := c.ticketService.ValidateTicket(r.Context(), operatorID, &req)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Ticket validated successfully", ticket)
}

func (c *TicketController) AnnulTicket(w http.ResponseWriter, r *http.Request) {
	operatorID := ""
	if user, ok := middlewares.GetUserFromContext(r.Context()); ok && user != nil {
		operatorID = user.ID
	} else {
		operatorID = r.Header.Get(headerXUserID)
	}

	if operatorID == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, errAuthRequired, nil)
		return
	}

	ticketID := r.PathValue("id")
	if ticketID == "" {
		c.jsonView.Error(w, http.StatusBadRequest, "Ticket ID path parameter is required", nil)
		return
	}

	var req struct {
		Reason string `json:"reason"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	if err := c.ticketService.AnnulTicket(r.Context(), operatorID, ticketID, req.Reason); err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Ticket annulled successfully", nil)
}

func (c *TicketController) GetPrices(w http.ResponseWriter, r *http.Request) {
	prices, err := c.ticketService.GetActivePrices(r.Context())
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}
	c.jsonView.Success(w, http.StatusOK, "Active ticket prices retrieved successfully", prices)
}

func (c *TicketController) UpdatePrice(w http.ResponseWriter, r *http.Request) {
	adminID := ""
	if user, ok := middlewares.GetUserFromContext(r.Context()); ok && user != nil {
		adminID = user.ID
	} else {
		adminID = r.Header.Get(headerXUserID)
	}

	if adminID == "" {
		c.jsonView.Error(w, http.StatusUnauthorized, errAuthRequired, nil)
		return
	}

	var req dto.UpdateTicketPriceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		c.jsonView.Error(w, http.StatusBadRequest, errInvalidPayload, err)
		return
	}

	updatedPrice, err := c.ticketService.UpdatePrice(r.Context(), adminID, &req)
	if err != nil {
		c.jsonView.Error(w, 0, "", err)
		return
	}

	c.jsonView.Success(w, http.StatusOK, "Ticket price updated successfully", updatedPrice)
}
