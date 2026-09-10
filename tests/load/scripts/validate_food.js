/**
 * Escenario 2 — Validación de Comida Concurrente (mismo ticket, N goroutines)
 *
 * El mismo ticket CON_COMIDA en estado USADO_ENTRADA es atacado por
 * BATCH_SIZE VUs simultáneamente. Solo uno debe ganar (200), el resto 409.
 *
 * Env vars requeridos:
 *   BASE_URL   — URL base del backend (ej: http://localhost:8080)
 *   JWT_TOKEN  — JWT de operador válido
 *   FOOD_TOKEN — public_token de un ticket ya en estado USADO_ENTRADA
 */
import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const doubleSuccesses = new Counter('food_double_successes');

export const options = {
  // Spike simultáneo: todos los VUs arrancan al mismo tiempo, 1 iteración.
  scenarios: {
    concurrent_food: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 10,
      maxDuration: '30s',
    },
  },
  thresholds: {
    // No debe haber ninguna doble validación de comida exitosa.
    food_double_successes: ['count==0'],
    http_req_failed: ['rate<0.5'], // 90% de requests deben fallar con 409
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN;
const FOOD_TOKEN = __ENV.FOOD_TOKEN;

let successCount = 0;

export default function validateFood() {
  if (!FOOD_TOKEN) {
    console.error('FOOD_TOKEN env var is required for validate_food.js');
    return;
  }

  const res = http.post(
    `${BASE_URL}/api/tickets/validate`,
    JSON.stringify({
      public_token: FOOD_TOKEN,
      validation_type: 'COMIDA',
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

  check(res, {
    'status is 200 or 409': (r) => r.status === 200 || r.status === 409,
    'no 500 error': (r) => r.status !== 500,
  });

  if (res.status === 200) {
    successCount++;
    if (successCount > 1) {
      doubleSuccesses.add(1);
      console.error(`DOUBLE FOOD CONSUMPTION DETECTED! (success #${successCount})`);
    }
  }
}
