/**
 * event_day.js — Simulación del día del evento (Ciclo de Vida Completo)
 *
 * Escenario:
 *   10 VUs (vendedores) ejecutan un total de 400 iteraciones compartidas.
 *
 * En cada iteración (un ciclo de vida de un ticket):
 *   1. Vende 1 ticket (tipo aleatorio).
 *   2. Realiza 5 GETs públicos.
 *   3. Realiza 2 validaciones de ENTRADA (espera 200 y luego 409).
 *   4. Tras cada validación, realiza 5 GETs públicos.
 *   5. Si el ticket es CON_COMIDA:
 *        a. Realiza 2 validaciones de COMIDA (espera 200 y luego 409).
 *        b. Tras cada validación, realiza 5 GETs públicos.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { vu } from 'k6/execution';

// ─── Métricas custom ────────────────────────────────────────────────────────
const ticketsSold        = new Counter('event_tickets_sold');
const entriesValidated   = new Counter('event_entries_validated');
const foodValidated      = new Counter('event_food_validated');
const publicViews        = new Counter('event_public_views');
const serverErrors       = new Counter('event_server_errors');
const doubleValidations  = new Counter('event_double_validations');
const saleFailures       = new Rate('event_sale_failure_rate');

const BASE_URL   = __ENV.BASE_URL  || 'http://localhost:8080';
const JWT_TOKEN  = __ENV.JWT_TOKEN;

let sellerTokens;
try {
  sellerTokens = JSON.parse(__ENV.SELLER_TOKENS || 'null');
} catch (_) {
  sellerTokens = null;
}
if (!Array.isArray(sellerTokens) || sellerTokens.length === 0) {
  sellerTokens = [JWT_TOKEN];
}

export const options = {
  scenarios: {
    event_lifecycle: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 400,
      maxDuration: '1m10s',
    },
  },
  thresholds: {
    http_req_duration:           ['p(95)<6000'],
    event_server_errors:         ['count==0'],
    event_double_validations:    ['count==0'],
    event_sale_failure_rate:     ['rate<0.1'],
    event_tickets_sold:          ['count>=50'],
  },
};

function getSellerToken() {
  const idx = (vu.idInTest - 1) % sellerTokens.length;
  return sellerTokens[idx];
}

function authHeaders(token) {
  return {
    'Content-Type':    'application/json',
    'Authorization':   `Bearer ${token}`,
    'X-Requested-With': 'XMLHttpRequest',
  };
}

function getPublicN(publicToken, times) {
  for (let i = 0; i < times; i++) {
    const res = http.get(`${BASE_URL}/api/tickets/public/${publicToken}`, {
      responseCallback: http.expectedStatuses(200, 404, 429),
      timeout: '10s',
    });
    check(res, { 'public: 200, 404 o 429': (r) => r.status === 200 || r.status === 404 || r.status === 429 });
    if (res.status === 500) serverErrors.add(1);
    else publicViews.add(1);
    sleep(0.02);
  }
}

function validateAndCheck(publicToken, type, isSecondAttempt) {
  const res = http.post(
    `${BASE_URL}/api/tickets/validate`,
    JSON.stringify({ public_token: publicToken, validation_type: type }),
    { headers: authHeaders(JWT_TOKEN), responseCallback: http.expectedStatuses(200, 409), timeout: '10s' }
  );

  check(res, { [`${type}: 200 o 409`]: (r) => r.status === 200 || r.status === 409 });
  if (res.status === 500) serverErrors.add(1);

  if (isSecondAttempt && res.status === 200) {
    doubleValidations.add(1);
    console.error(`DOBLE VALIDACIÓN ${type} detectada: ${publicToken}`);
  }
  
  if (!isSecondAttempt && res.status === 200) {
      if(type === 'ENTRADA') entriesValidated.add(1);
      if(type === 'COMIDA') foodValidated.add(1);
  }
  
  getPublicN(publicToken, 5);
}

export default function () {
  const sellerToken = getSellerToken();
  const ticketType  = Math.random() > 0.5 ? 'CON_COMIDA' : 'SIMPLE';
  const idx = vu.iterationInScenario;

  // 1. Venta
  const payload = JSON.stringify({
    first_name:  'EventTest',
    last_name:   `User${idx}`,
    phone:       `09${String(idx).padStart(8, '0')}`,
    email:       `event.test.${idx}.${Date.now()}@test.local`,
    ticket_type: ticketType,
    sale_source: 'PUERTA',
  });

  const resSale = http.post(`${BASE_URL}/api/tickets`, payload, {
    headers:          authHeaders(sellerToken),
    responseCallback: http.expectedStatuses(200, 201, 400, 409),
    timeout:          '15s',
  });

  const saleOk = resSale.status === 201 || resSale.status === 200;
  saleFailures.add(!saleOk ? 1 : 0);

  if (!saleOk) {
    if (resSale.status === 500) serverErrors.add(1);
    sleep(1);
    return; // abort lifecycle for this ticket
  }

  ticketsSold.add(1);
  const publicToken = resSale.json('data.public_token');

  // 2. 5 GETs post-venta
  getPublicN(publicToken, 5);

  // 3. Validar Entrada 1 (Debe ser 200) y 5 GETs
  validateAndCheck(publicToken, 'ENTRADA', false);

  // 4. Validar Entrada 2 (Debe ser 409) y 5 GETs
  validateAndCheck(publicToken, 'ENTRADA', true);

  // 5. Validaciones de comida si aplica
  if (ticketType === 'CON_COMIDA') {
    validateAndCheck(publicToken, 'COMIDA', false); // Debe ser 200
    validateAndCheck(publicToken, 'COMIDA', true);  // Debe ser 409
  }
}

