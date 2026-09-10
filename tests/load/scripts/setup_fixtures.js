/**
 * setup_fixtures.js — Crea tickets de prueba vía API y genera seed_tokens.json
 *
 * Ejecuta N iteraciones secuenciales (1 VU) para crear tickets frescos en estado
 * VENDIDO. Luego valida uno como ENTRADA para obtener un FOOD_TOKEN (CON_COMIDA).
 * Escribe el resultado en fixtures/seed_tokens.json y fixtures/food_token.txt.
 *
 * Env vars requeridos:
 *   BASE_URL   — URL base del backend (ej: http://localhost:8080)
 *   JWT_TOKEN  — JWT de operador con rol SELLER o ADMIN
 *
 * Env vars opcionales:
 *   FIXTURE_COUNT — cantidad de tickets a crear (default: 50)
 */
import http from 'k6/http';
import { check, fail } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN;
const FIXTURE_COUNT = Number.parseInt(__ENV.FIXTURE_COUNT || '50', 10);

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    // El setup debe completarse sin errores de servidor.
    http_req_failed: ['rate==0'],
  },
};

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JWT_TOKEN}`,
  'X-Requested-With': 'XMLHttpRequest',
};

function createSingleTicket(i) {
  const ticketType = i % 3 === 0 ? 'CON_COMIDA' : 'SIMPLE';
  const payload = JSON.stringify({
    first_name: 'LoadTest',
    last_name: `User${i}`,
    phone: `09${String(i).padStart(8, '0')}`,
    email: `load.test.${i}.${Date.now()}@test.local`,
    ticket_type: ticketType,
    sale_source: 'PUERTA',
  });

  const res = http.post(`${BASE_URL}/api/tickets`, payload, {
    headers: HEADERS,
    timeout: '15s',
  });

  const ok = check(res, {
    [`ticket ${i} created (201)`]: (r) => r.status === 201 || r.status === 200,
  });

  if (!ok) {
    console.error(`[setup] Failed to create ticket ${i}: HTTP ${res.status} — ${res.body}`);
    if (res.status === 409 || res.status === 400) {
      console.warn(`[setup] Quota/validation issue at ticket ${i}, stopping creation.`);
      return null;
    }
    fail(`Unexpected error creating ticket ${i}: HTTP ${res.status}`);
  }

  const body = JSON.parse(res.body);
  return {
    public_token: body.public_token,
    four_digit_code: body.four_digit_code,
    ticket_type: body.ticket_type,
    status: 'VENDIDO',
  };
}

function obtainFoodToken(fixtures) {
  const conComidaTicket = fixtures.find((t) => t.ticket_type === 'CON_COMIDA');
  if (!conComidaTicket) {
    console.warn('[setup] No CON_COMIDA ticket found among created fixtures. Escenario 2 will be skipped.');
    return null;
  }

  console.log(`[setup] Validating 1 CON_COMIDA ticket as ENTRADA to obtain FOOD_TOKEN...`);
  const validateRes = http.post(
    `${BASE_URL}/api/tickets/validate`,
    JSON.stringify({
      public_token: conComidaTicket.public_token,
      validation_type: 'ENTRADA',
    }),
    { headers: HEADERS, timeout: '10s' }
  );

  if (validateRes.status === 200) {
    conComidaTicket.status = 'USADO_ENTRADA';
    console.log(`[setup] FOOD_TOKEN obtained: ${conComidaTicket.public_token}`);
    return conComidaTicket.public_token;
  }

  console.warn(
    `[setup] Could not validate CON_COMIDA ticket as ENTRADA: HTTP ${validateRes.status}. Escenario 2 will be skipped.`
  );
  return null;
}

export default function setup() {
  if (!JWT_TOKEN) {
    fail('JWT_TOKEN is required');
  }

  const fixtures = [];
  console.log(`[setup] Creating ${FIXTURE_COUNT} test tickets...`);

  for (let i = 0; i < FIXTURE_COUNT; i++) {
    const fixture = createSingleTicket(i);
    if (!fixture) break;
    fixtures.push(fixture);
  }

  if (fixtures.length === 0) {
    fail('[setup] No tickets were created. Check quota and JWT permissions.');
  }

  const foodToken = obtainFoodToken(fixtures);

  console.log(`[setup] FIXTURE_OUTPUT:${JSON.stringify(fixtures)}`);
  if (foodToken) {
    console.log(`[setup] FOOD_TOKEN_OUTPUT:${foodToken}`);
  }

  console.log(`[setup] Done. ${fixtures.length} fixtures ready.`);
}
