import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ApiResponse,
  HealthStatus,
  Ticket,
  CreateTicketRequest,
  ValidateTicketRequest,
  QuotaSummary,
  UpdateQuotaRequest,
  User,
  UpdateUserStatusRequest,
  UpdateUserRoleRequest,
  TicketPriceConfig,
  UpdateTicketPriceRequest,
  PublicTicket
} from '../models/api.models';
import { getApiUrl } from '../utils/env.utils';

export type { HealthStatus, Ticket, QuotaSummary, User, TicketPriceConfig, CreateTicketPayload, TicketResponse, PublicTicket } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private get baseUrl(): string {
    return getApiUrl();
  }

  constructor(private readonly http: HttpClient) {}

  // Unprotected Public Endpoints
  getHealth(): Observable<ApiResponse<HealthStatus>> {
    return this.http.get<ApiResponse<HealthStatus>>(`${this.baseUrl}/health`);
  }

  private mapTicket(t: any): Ticket {
    if (!t) return t;
    return {
      ...t,
      ticketNumber: t.ticket_number,
      publicToken: t.public_token,
      fourDigitCode: t.four_digit_code,
      ticketType: t.ticket_type,
      saleSource: t.sale_source,
      quotaSource: t.quota_source,
      pricePaid: t.price_paid,
      sellerId: t.seller_id || t.seller?.id,
      sellerName: t.seller?.name,
      buyerName: t.buyer ? `${t.buyer.first_name} ${t.buyer.last_name}` : undefined
    };
  }

  getPublicTicket(token: string): Observable<ApiResponse<Ticket>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/api/tickets/public/${encodeURIComponent(token)}`).pipe(
      map(res => {
        if (res.success && res.data) res.data = this.mapTicket(res.data);
        return res;
      })
    );
  }

  getPublicTicketRaw(token: string): Observable<ApiResponse<PublicTicket>> {
    return this.http.get<ApiResponse<PublicTicket>>(`${this.baseUrl}/api/tickets/public/${encodeURIComponent(token)}`);
  }

  // Ticket Management
  listTickets(sellerId?: string): Observable<ApiResponse<Ticket[]>> {
    const url = sellerId
      ? `${this.baseUrl}/api/tickets?seller_id=${encodeURIComponent(sellerId)}`
      : `${this.baseUrl}/api/tickets`;
    return this.http.get<ApiResponse<any[]>>(url).pipe(
      map(res => {
        if (res.success && res.data) res.data = res.data.map(t => this.mapTicket(t));
        return res;
      })
    );
  }

  createTicket(req: CreateTicketRequest): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/tickets`, req).pipe(
      map(res => {
        if (res.success && res.data) res.data = this.mapTicket(res.data);
        return res;
      })
    );
  }

  validateTicket(req: ValidateTicketRequest): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/tickets/validate`, req).pipe(
      map(res => {
        if (res.success && res.data) res.data = this.mapTicket(res.data);
        return res;
      })
    );
  }

  annulTicket(id: string, reason: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/api/tickets/${encodeURIComponent(id)}/annul`, { reason });
  }

  // Quota Management
  getSellerQuota(sellerId: string): Observable<ApiResponse<QuotaSummary>> {
    return this.http.get<ApiResponse<QuotaSummary>>(`${this.baseUrl}/api/quotas/seller/${encodeURIComponent(sellerId)}`);
  }

  getGlobalFreeQuota(): Observable<ApiResponse<QuotaSummary>> {
    return this.http.get<ApiResponse<QuotaSummary>>(`${this.baseUrl}/api/quotas/free`);
  }

  updateQuota(req: UpdateQuotaRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/api/quotas`, req);
  }

  // Admin User Management
  listUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/api/users`);
  }

  updateUserStatus(userId: string, req: UpdateUserStatusRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/api/users/${encodeURIComponent(userId)}/status`, req);
  }

  updateUserRole(userId: string, req: UpdateUserRoleRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/api/users/${encodeURIComponent(userId)}/role`, req);
  }

  // Price Management
  getTicketPrices(): Observable<ApiResponse<TicketPriceConfig[]>> {
    return this.http.get<ApiResponse<TicketPriceConfig[]>>(`${this.baseUrl}/api/prices`);
  }

  updateTicketPrice(req: UpdateTicketPriceRequest): Observable<ApiResponse<TicketPriceConfig>> {
    return this.http.put<ApiResponse<TicketPriceConfig>>(`${this.baseUrl}/api/prices`, req);
  }
}
