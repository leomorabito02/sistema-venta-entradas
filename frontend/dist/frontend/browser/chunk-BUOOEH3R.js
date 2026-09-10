import {
  HttpClient,
  Injectable,
  __spreadProps,
  __spreadValues,
  getApiUrl,
  map,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-SFLJKOAY.js";

// src/app/core/services/api.service.ts
var ApiService = class _ApiService {
  http;
  get baseUrl() {
    return getApiUrl();
  }
  constructor(http) {
    this.http = http;
  }
  // Unprotected Public Endpoints
  getHealth() {
    return this.http.get(`${this.baseUrl}/health`);
  }
  mapTicket(t) {
    if (!t)
      return t;
    return __spreadProps(__spreadValues({}, t), {
      ticketNumber: t.ticket_number,
      publicToken: t.public_token,
      fourDigitCode: t.four_digit_code,
      ticketType: t.ticket_type,
      saleSource: t.sale_source,
      quotaSource: t.quota_source,
      pricePaid: t.price_paid,
      sellerId: t.seller_id || t.seller?.id,
      sellerName: t.seller?.name,
      buyerName: t.buyer ? `${t.buyer.first_name} ${t.buyer.last_name}` : void 0
    });
  }
  getPublicTicket(token) {
    return this.http.get(`${this.baseUrl}/api/tickets/public/${encodeURIComponent(token)}`).pipe(map((res) => {
      if (res.success && res.data)
        res.data = this.mapTicket(res.data);
      return res;
    }));
  }
  getPublicTicketRaw(token) {
    return this.http.get(`${this.baseUrl}/api/tickets/public/${encodeURIComponent(token)}`);
  }
  // Ticket Management
  listTickets(sellerId) {
    const url = sellerId ? `${this.baseUrl}/api/tickets?seller_id=${encodeURIComponent(sellerId)}` : `${this.baseUrl}/api/tickets`;
    return this.http.get(url).pipe(map((res) => {
      if (res.success && res.data)
        res.data = res.data.map((t) => this.mapTicket(t));
      return res;
    }));
  }
  createTicket(req) {
    return this.http.post(`${this.baseUrl}/api/tickets`, req).pipe(map((res) => {
      if (res.success && res.data)
        res.data = this.mapTicket(res.data);
      return res;
    }));
  }
  validateTicket(req) {
    return this.http.post(`${this.baseUrl}/api/tickets/validate`, req).pipe(map((res) => {
      if (res.success && res.data)
        res.data = this.mapTicket(res.data);
      return res;
    }));
  }
  annulTicket(id, reason) {
    return this.http.post(`${this.baseUrl}/api/tickets/${encodeURIComponent(id)}/annul`, { reason });
  }
  // Quota Management
  getSellerQuota(sellerId) {
    return this.http.get(`${this.baseUrl}/api/quotas/seller/${encodeURIComponent(sellerId)}`);
  }
  getGlobalFreeQuota() {
    return this.http.get(`${this.baseUrl}/api/quotas/free`);
  }
  updateQuota(req) {
    return this.http.put(`${this.baseUrl}/api/quotas`, req);
  }
  getAdminQuotaOverview() {
    return this.http.get(`${this.baseUrl}/api/admin/quotas/overview`);
  }
  getDefaultQuotaConfig() {
    return this.http.get(`${this.baseUrl}/api/admin/quotas/config`);
  }
  updateDefaultQuotaConfig(defaultPersonalQuota) {
    return this.http.put(`${this.baseUrl}/api/admin/quotas/config`, { default_personal_quota: defaultPersonalQuota });
  }
  getExhaustedSellers() {
    return this.http.get(`${this.baseUrl}/api/admin/quotas/exhausted`);
  }
  // Admin User Management
  listUsers() {
    return this.http.get(`${this.baseUrl}/api/users`);
  }
  updateUserStatus(userId, req) {
    return this.http.put(`${this.baseUrl}/api/users/${encodeURIComponent(userId)}/status`, req);
  }
  updateUserRole(userId, req) {
    return this.http.put(`${this.baseUrl}/api/users/${encodeURIComponent(userId)}/role`, req);
  }
  // Price Management
  getTicketPrices() {
    return this.http.get(`${this.baseUrl}/api/prices`);
  }
  updateTicketPrice(req) {
    return this.http.put(`${this.baseUrl}/api/prices`, req);
  }
  static \u0275fac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  ApiService
};
//# sourceMappingURL=chunk-BUOOEH3R.js.map
