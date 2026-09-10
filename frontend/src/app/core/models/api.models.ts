export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SELLER' | 'OPERATOR';
  status: 'PENDING' | 'ACTIVE' | 'DISABLED';
}

export interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: User;
  status?: string;
  is_new?: boolean;
}

export interface CreateTicketPayload {
  ticket_type: 'SIMPLE' | 'CON_COMIDA';
  sale_source: 'ANTICIPADA' | 'PUERTA';
  quota_source?: 'PERSONAL' | 'LIBRE';
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
}

export type CreateTicketRequest = CreateTicketPayload;

export interface TicketResponse {
  id: string;
  ticket_number: number;
  public_token: string;
  public_url: string;
  four_digit_code: string;
  ticket_type: 'SIMPLE' | 'CON_COMIDA';
  sale_source: 'ANTICIPADA' | 'PUERTA';
  quota_source?: string;
  price_paid: number;
  status: string;
  buyer?: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
  };
  created_at?: string;
  entry_validated_at?: string;
  entry_validator_name?: string;
  food_validated_at?: string;
  food_validator_name?: string;
}

export interface Ticket {
  id: string;
  ticketNumber?: number;
  publicToken: string;
  fourDigitCode?: string;
  ticketType: 'SIMPLE' | 'CON_COMIDA';
  saleSource: 'ANTICIPADA' | 'PUERTA';
  quotaSource?: 'PERSONAL' | 'LIBRE';
  pricePaid: number;
  status: 'VENDIDO' | 'USADO_ENTRADA' | 'USADO_COMIDA' | 'ANULADO';
  buyerId?: string;
  sellerId: string;
  createdAt?: string;
  sellerName?: string;
  buyerName?: string;
  entryValidatedAt?: string;
  entryValidatorName?: string;
  foodValidatedAt?: string;
  foodValidatorName?: string;
}

export interface SellerRankingItem {
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  totalIssued: number;
  totalRevenue: number;
  averageTicket: number;
  anticipadaCount: number;
  puertaCount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalIssued: number;
  ticketsSimpleCount: number;
  ticketsSimpleRevenue: number;
  ticketsConComidaCount: number;
  ticketsConComidaRevenue: number;
  anticipadaCount: number;
  anticipadaRevenue: number;
  anticipadaVolumePct: number;
  anticipadaRevenuePct: number;
  puertaCount: number;
  puertaRevenue: number;
  puertaVolumePct: number;
  puertaRevenuePct: number;
  averageTicketPrice: number;
  entriesUsedCount: number;
  foodDeliveredCount: number;
  foodPendingCount: number;
  annulledCount: number;
  annulledRevenue: number;
  recentTickets: Ticket[];
}

export interface ValidateTicketRequest {
  public_token?: string;
  four_digit_code?: string;
  validation_type: 'ENTRADA' | 'COMIDA';
}

export interface AnnulTicketRequest {
  reason: string;
}

export interface QuotaSummary {
  seller_id?: string;
  seller_name?: string;
  assigned_quota?: number;
  used_quota?: number;
  available_quota?: number;
  used_free_quota?: number;
  total_free_quota?: number;
  // Legacy alias fields
  sellerId?: string;
  assignedQuota?: number;
  usedQuota?: number;
  remainingQuota?: number;
}

export interface UpdateQuotaRequest {
  quota_type: 'PERSONAL' | 'FREE';
  assigned_quota: number;
  seller_id?: string;
  // Legacy alias fields for form models
  quotaType?: 'PERSONAL' | 'FREE';
  assignedQuota?: number;
  sellerId?: string;
}

export interface SellerQuotaDetail {
  seller_id: string;
  seller_name: string;
  seller_email: string;
  assigned_quota: number;
  used_quota: number;
  remaining_personal: number;
  used_free_quota: number;
  is_personal_exhausted: boolean;
  updated_at?: string;
}

export interface SellerFreeQuotaUsage {
  seller_id: string;
  seller_name: string;
  seller_email: string;
  used_free_quota: number;
}

export interface DefaultQuotaConfigResponse {
  default_personal_quota: number;
}

export interface UpdateDefaultQuotaRequest {
  default_personal_quota: number;
}

export interface AdminQuotaOverviewResponse {
  default_personal_quota: number;
  global_free_quota: {
    total_free_quota: number;
    used_free_quota: number;
    available_quota: number;
  };
  sellers_quotas: SellerQuotaDetail[];
  free_quota_usage_by_seller: SellerFreeQuotaUsage[];
  exhausted_sellers: SellerQuotaDetail[];
}

export interface UpdateUserStatusRequest {
  status: 'PENDING' | 'ACTIVE' | 'DISABLED';
}

export interface UpdateUserRoleRequest {
  role: 'ADMIN' | 'SELLER' | 'OPERATOR';
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: string;
}

export interface TicketPriceConfig {
  ticket_type: 'SIMPLE' | 'CON_COMIDA';
  price: number;
}

export interface UpdateTicketPriceRequest {
  ticket_type: 'SIMPLE' | 'CON_COMIDA';
  price: number;
}

export interface PublicTicket {
  ticket_number: number;
  four_digit_code: string;
  public_token: string;
  ticket_type: 'SIMPLE' | 'CON_COMIDA';
  sale_source?: 'ANTICIPADA' | 'PUERTA';
  status: 'VENDIDO' | 'USADO_ENTRADA' | 'USADO_COMIDA' | 'ANULADO';
  price_paid: number;
  buyer_name: string;
  seller_name: string;
  includes_food: boolean;
  created_at: string;
  entry_validated_at?: string;
  food_validated_at?: string;
}
