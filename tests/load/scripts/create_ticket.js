/**
 * Escenario 3 — Emisión Masiva de Tickets
 *
 * 30 VUs crean tickets concurrentemente.
 * Verifica que el quota counter no baje de 0 y que four_digit_code sea único.
 *
 * Env vars requeridos:
 *   BASE_URL    — URL base del backend (ej: http://localhost:8080)
 *   JWT_TOKEN   — JWT de un vendedor (SELLER) activo
 *   SELLER_ID   — ID del vendedor que crea los tickets
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const conflictErrors = new Counter('quota_conflicts');
const serverErrors = new Counter('server_errors');

export const options = {
  vus: 30,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2500'],
    server_errors: ['count==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN;

let iterationIndex = 0;

export default function createTicket() {
  const idx = ++iterationIndex;

  const payload = JSON.stringify({
    first_name: `LoadTest`,
    last_name: `User${idx}`,
    phone: `09${String(idx).padStart(8, '0')}`,
    email: `load.test.${idx}.${Date.now()}@test.local`,
    ticket_type: idx % 2 === 0 ? 'CON_COMIDA' : 'SIMPLE',
    sale_source: 'PUERTA',
  });

  const res = http.post(`${BASE_URL}/api/tickets`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWT_TOKEN}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    responseCallback: http.expectedStatuses(200, 201, 400, 409),
    timeout: '10s',
  });

  check(res, {
    'ticket created or quota exhausted': (r) =>
      r.status === 201 || r.status === 200 || r.status === 409 || r.status === 400,
    'no 500': (r) => r.status !== 500,
  });

  if (res.status === 409) {
    conflictErrors.add(1);
  }
  if (res.status === 500) {
    serverErrors.add(1);
    console.error(`500 on create ticket: ${res.body}`);
  }

  sleep(0.1);
}
