/**
 * Escenario 4 — Spike Test (pico de carga sobre endpoint público)
 *
 * Rampa agresiva 0 → 200 VUs en 10s sobre GET /api/tickets/public/{token}.
 * Verifica que el servidor no crashea y degrada de forma controlada.
 *
 * Env vars requeridos:
 *   BASE_URL — URL base del backend (ej: http://localhost:8080)
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const tokens = JSON.parse(open('../fixtures/seed_tokens.json'));
const serverErrors = new Counter('spike_server_errors');

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 }, // Rampa agresiva
        { duration: '20s', target: 200 }, // Carga sostenida
        { duration: '10s', target: 0 },   // Bajada
      ],
    },
  },
  thresholds: {
    // En un spike, toleramos 429 (Rate Limit), pero NO crashes (500s).
    // http_req_failed default de k6 marca los 400s y 429s como fallos, así que
    // no podemos usarlo con un rate bajo.
    spike_server_errors: ['count==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function spikePublic() {
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % tokens.length;
  const ticket = tokens[randomIndex];

  const res = http.get(`${BASE_URL}/api/tickets/public/${ticket.public_token}`, {
    timeout: '10s',
  });

  check(res, {
    'status 200, 404 or 429': (r) => r.status === 200 || r.status === 404 || r.status === 429,
    'no 500': (r) => r.status !== 500,
  });

  if (res.status === 500) {
    serverErrors.add(1);
    console.error(`500 in spike test: ${res.body}`);
  }

  sleep(0.02);
}
