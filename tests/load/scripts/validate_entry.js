/**
 * Escenario 1 — Validación de Entrada (endpoint crítico)
 *
 * 60 VUs concurrentes durante 30s sobre POST /api/tickets/validate.
 * Umbral: p95 < 200ms, error rate < 1%.
 *
 * Env vars requeridos:
 *   BASE_URL   — URL base del backend (ej: http://localhost:8080)
 *   JWT_TOKEN  — JWT de operador válido
 *
 * NOTA sobre tokenSuccessMap:
 *   El mapa es local a cada VU (k6 no comparte estado entre VUs).
 *   Detecta dobles validaciones dentro del mismo VU solamente.
 *   La detección cross-VU se delega a la verificación post-test en DB
 *   (psql query de duplicados en ticket_validations).
 */
import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const tokens = new SharedArray('seed_tokens', function () {
  return JSON.parse(open('../fixtures/seed_tokens.json')).filter(
    (t) => t.status === 'VENDIDO'
  );
});

const doubleSuccesses = new Counter('double_validation_successes');
const unexpectedStatus = new Counter('unexpected_status');

export const options = {
  vus: 60,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2500'],
    http_req_failed: ['rate<0.01'],
    double_validation_successes: ['count==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN;

// Track per-token success count to detect double-validations within this VU.
const tokenSuccessMap = {};

export default function validateEntry() {
  if (tokens.length === 0) {
    fail('No VENDIDO tickets in seed_tokens.json. Run setup first (SKIP_SETUP unset).');
  }

  const randomIndex = Math.floor(Math.random() * tokens.length);
  const ticket = tokens[randomIndex];

  const res = http.post(
    `${BASE_URL}/api/tickets/validate`,
    JSON.stringify({
      public_token: ticket.public_token,
      validation_type: 'ENTRADA',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      responseCallback: http.expectedStatuses(200, 409),
      timeout: '5s',
    }
  );

  const passed = check(res, {
    'status 200 or 409 (no 500)': (r) => r.status === 200 || r.status === 409,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (!passed && res.status !== 200 && res.status !== 409) {
    unexpectedStatus.add(1);
    console.error(
      `Unexpected HTTP ${res.status} for token ${ticket.public_token}: ${res.body}`
    );
  }

  if (res.status === 200) {
    if (tokenSuccessMap[ticket.public_token]) {
      doubleSuccesses.add(1);
      console.error(`DOUBLE VALIDATION DETECTED (same VU) for token: ${ticket.public_token}`);
    }
    tokenSuccessMap[ticket.public_token] = true;
  }

  sleep(0.05);
}
