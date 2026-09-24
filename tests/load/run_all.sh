#!/usr/bin/env bash
# =============================================================================
# run_all.sh — Orquestador de tests de carga y concurrencia
#
# Uso:
#   cd tests/load
#   bash run_all.sh
#
# Variables requeridas (vía .env.test o export):
#   DATABASE_URL   — DSN de NeonDB (para verificación post-test con psql)
#   JWT_TOKEN      — JWT de operador activo (SELLER o ADMIN)
#
# Variables opcionales:
#   BASE_URL       — URL del backend (default: http://localhost:8080)
#   FOOD_TOKEN     — public_token de ticket en estado USADO_ENTRADA (auto-detectado)
#   FIXTURE_COUNT  — cantidad de tickets a crear en setup (default: 50)
#   SKIP_SETUP     — si está seteado, omite la creación de fixtures vía API
# =============================================================================
set -euo pipefail

# ─── Detectar directorio del script para paths relativos robustos ─────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Auto-cargar .env.test si existe ─────────────────────────────────────────
ENV_FILE="$SCRIPT_DIR/.env.test"
if [ -f "$ENV_FILE" ]; then
  echo "  Loading $ENV_FILE"
  # shellcheck disable=SC1090
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
fi

# ─── Variables con defaults ───────────────────────────────────────────────────
BASE_URL="${BASE_URL:-http://localhost:8080}"
DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required (set in .env.test or environment)}"
FOOD_TOKEN="${FOOD_TOKEN:-}"
FIXTURE_COUNT="${FIXTURE_COUNT:-50}"
RESULTS_DIR="$SCRIPT_DIR/results/$(date +%Y%m%d_%H%M%S)"

# ─── JWT: auto-generar si no está seteado ────────────────────────────────────
if [ -z "${JWT_TOKEN:-}" ]; then
  echo "▶ Auto-generating JWT_TOKEN..."
  BACKEND_DIR="$SCRIPT_DIR/../../backend"
  # Usar el binario pre-compilado si existe, si no compilar on-demand.
  GEN_JWT_BIN="$BACKEND_DIR/tools/gen_test_jwt/gen_test_jwt"
  if [ -x "$GEN_JWT_BIN" ]; then
    JWT_TOKEN=$(cd "$BACKEND_DIR" && DATABASE_URL="$DATABASE_URL" "$GEN_JWT_BIN" 2>/dev/null)
  else
    JWT_TOKEN=$(cd "$BACKEND_DIR" && DATABASE_URL="$DATABASE_URL" go run tools/gen_test_jwt/main.go 2>/dev/null)
  fi
fi
JWT_TOKEN="${JWT_TOKEN:?JWT_TOKEN is required and could not be auto-generated}"

mkdir -p "$RESULTS_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║         SISTEMA VENTA ENTRADAS — LOAD TESTS          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo "  Backend      : $BASE_URL"
echo "  Results      : $RESULTS_DIR"
echo "  Fixture count: $FIXTURE_COUNT"
echo ""

# ─── Verificar dependencias ───────────────────────────────────────────────────
for cmd in k6 go; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "✗ '$cmd' not found in PATH. Aborting."
    exit 1
  fi
done

if ! command -v psql >/dev/null 2>&1; then
  echo "  ⚠ 'psql' not found in PATH. Post-test database verification will be skipped."
fi

# ─── Paso 0: Health Check ────────────────────────────────────────────────────
echo "▶ [0/6] Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$STATUS" != "200" ]; then
  echo "✗ Backend no responde en $BASE_URL/health (HTTP $STATUS). Aborting."
  exit 1
fi
echo "  ✓ Backend healthy"

# ─── Paso 1: Crear fixtures vía API (paralelo) ───────────────────────────────
echo ""
if [ -n "${SKIP_SETUP:-}" ]; then
  echo "▶ [1/6] Skipping fixture setup (SKIP_SETUP is set)"
  if [ ! -f "$SCRIPT_DIR/fixtures/seed_tokens.json" ]; then
    echo "✗ SKIP_SETUP is set but fixtures/seed_tokens.json does not exist. Aborting."
    exit 1
  fi
else
  SETUP_WORKERS="${SETUP_WORKERS:-10}"
  echo "▶ [1/6] Creating ${FIXTURE_COUNT} test tickets (${SETUP_WORKERS} parallel workers)..."

  SETUP_BIN="$SCRIPT_DIR/setup_api/setup_api"

  # Compilar si el binario no existe o el fuente es más nuevo.
  if [ ! -x "$SETUP_BIN" ] || [ "$SCRIPT_DIR/setup_api/main.go" -nt "$SETUP_BIN" ]; then
    echo "  Building setup_api binary..."
    (cd "$SCRIPT_DIR/setup_api" && go build -o setup_api . 2>&1) || {
      echo "✗ Failed to build setup_api. Aborting."
      exit 1
    }
  fi

  SETUP_OUT=$( \
    cd "$SCRIPT_DIR" && \
    BASE_URL="$BASE_URL" JWT_TOKEN="$JWT_TOKEN" \
    "$SETUP_BIN" \
      -count "$FIXTURE_COUNT" \
      -workers "$SETUP_WORKERS" \
      -out "fixtures/seed_tokens.json" \
    2>&1 \
  )
  SETUP_EXIT=$?

  echo "$SETUP_OUT" | grep -v "^FOOD_TOKEN_OUTPUT:" | sed 's/^/  /' || true

  if [ $SETUP_EXIT -ne 0 ]; then
    echo "✗ setup_api failed (exit $SETUP_EXIT). Aborting."
    exit 1
  fi

  if [ ! -f "$SCRIPT_DIR/fixtures/seed_tokens.json" ]; then
    echo "✗ seed_tokens.json was not created. Aborting."
    exit 1
  fi

  FIXTURE_COUNT_ACTUAL=$(python3 -c "import json,sys; print(len(json.load(open('$SCRIPT_DIR/fixtures/seed_tokens.json'))))" 2>/dev/null || echo "?")
  echo "  ✓ Fixtures created: $FIXTURE_COUNT_ACTUAL tickets → fixtures/seed_tokens.json"

  # Capturar FOOD_TOKEN del stdout del setup (línea FOOD_TOKEN_OUTPUT:...).
  if [ -z "$FOOD_TOKEN" ]; then
    FOOD_TOKEN=$(echo "$SETUP_OUT" | grep "^FOOD_TOKEN_OUTPUT:" | sed 's/^FOOD_TOKEN_OUTPUT://' | tr -d '[:space:]' || true)
    if [ -n "$FOOD_TOKEN" ]; then
      echo "  ✓ FOOD_TOKEN auto-detected: ${FOOD_TOKEN:0:16}..."
    fi
  fi
fi


# ─── Paso 2: Escenario 1 — Validate Entry (60 VUs) ───────────────────────────
echo ""
echo "▶ [2/6] Escenario 1: Validate Entry — 60 VUs / 30s..."
k6 run \
  -e BASE_URL="$BASE_URL" \
  -e JWT_TOKEN="$JWT_TOKEN" \
  --out json="$RESULTS_DIR/validate_entry.json" \
  "$SCRIPT_DIR/scripts/validate_entry.js"
echo "  ✓ Done"

# ─── Paso 3: Escenario 2 — Validate Food Concurrent ──────────────────────────
echo ""
if [ -n "$FOOD_TOKEN" ]; then
  echo "▶ [3/6] Escenario 2: Validate Food Concurrent — 10 VUs mismo ticket..."
  k6 run \
    -e BASE_URL="$BASE_URL" \
    -e JWT_TOKEN="$JWT_TOKEN" \
    -e FOOD_TOKEN="$FOOD_TOKEN" \
    --out json="$RESULTS_DIR/validate_food.json" \
    "$SCRIPT_DIR/scripts/validate_food.js"
  echo "  ✓ Done"
else
  echo "▶ [3/6] Escenario 2 SKIPPED — no CON_COMIDA ticket in USADO_ENTRADA state available"
  echo "  Hint: Increase FIXTURE_COUNT or set FOOD_TOKEN manually"
fi

# ─── Paso 4: Escenario 3 — Create Ticket (30 VUs) ────────────────────────────
echo ""
echo "▶ [4/6] Escenario 3: Create Ticket — 30 VUs / 30s..."
k6 run \
  -e BASE_URL="$BASE_URL" \
  -e JWT_TOKEN="$JWT_TOKEN" \
  --out json="$RESULTS_DIR/create_ticket.json" \
  "$SCRIPT_DIR/scripts/create_ticket.js"
echo "  ✓ Done"

# ─── Paso 5: Escenario 4 — Spike Public ──────────────────────────────────────
echo ""
echo "▶ [5/6] Escenario 4: Spike Test — 0→200 VUs en 10s..."
k6 run \
  -e BASE_URL="$BASE_URL" \
  --out json="$RESULTS_DIR/spike_public.json" \
  "$SCRIPT_DIR/scripts/spike_public.js"
echo "  ✓ Done"

# ─── Paso 6: Escenario Día del Evento — 60s integrado ───────────────────────
echo ""
echo "▶ [6/6] Escenario Día del Evento — 10 vendedores / 400 ventas / 60s..."
echo "  Incluye: 2 validaciones de entrada + 2 de comida por ticket"
echo "           5 GETs públicos por venta y por cada validación"
k6 run \
  -e BASE_URL="$BASE_URL" \
  -e JWT_TOKEN="$JWT_TOKEN" \
  --out json="$RESULTS_DIR/event_day.json" \
  "$SCRIPT_DIR/scripts/event_day.js"
echo "  ✓ Done"

# ─── Verificación Post-Test: Unicidad four_digit_code ────────────────────────
echo ""
echo "▶ Post-test: Verificando unicidad de four_digit_code en DB..."
if command -v psql >/dev/null 2>&1; then
  DUPES=$(psql "$DATABASE_URL" -t -c \
    "SELECT COUNT(*) FROM (SELECT four_digit_code FROM tickets GROUP BY four_digit_code HAVING COUNT(*) > 1) sub;" \
    2>/dev/null | tr -d ' ')

  if [ "$DUPES" = "0" ]; then
    echo "  ✓ No four_digit_code duplicados encontrados"
  else
    echo "  ✗ ALERTA: $DUPES four_digit_code(s) DUPLICADOS encontrados. Revisar condición de carrera."
    exit 1
  fi
else
  echo "  ⚠ 'psql' no instalado. Se omite la verificación post-test en DB."
fi

# ─── Limpieza: borrar registros generados por el load test ───────────────────
echo ""
echo "▶ Post-test: Limpieza de registros de load test en DB..."
if command -v psql >/dev/null 2>&1; then
  # Borrar en orden correcto respetando FK: validaciones → tickets
  # Se identifican por el patrón de email usado en setup_api y en event_day.js
  CLEANUP_SQL="
    BEGIN;

    DELETE FROM ticket_validations
    WHERE ticket_id IN (
      SELECT id FROM tickets
      WHERE email LIKE '%@test.local'
        AND (email LIKE 'load.test.%' OR email LIKE 'event.test.%')
    );

    DELETE FROM tickets
    WHERE email LIKE '%@test.local'
      AND (email LIKE 'load.test.%' OR email LIKE 'event.test.%');

    COMMIT;
  "

  DELETED=$(psql "$DATABASE_URL" -t -c "
    SELECT COUNT(*) FROM tickets
    WHERE email LIKE '%@test.local'
      AND (email LIKE 'load.test.%' OR email LIKE 'event.test.%');
  " 2>/dev/null | tr -d ' ')

  echo "  Registros a eliminar: ${DELETED:-?} tickets (+ sus validaciones)"

  psql "$DATABASE_URL" -c "$CLEANUP_SQL" >/dev/null 2>&1 && \
    echo "  ✓ Limpieza completada" || \
    echo "  ✗ Error en limpieza. Ejecutar manualmente si es necesario."
else
  echo "  ⚠ 'psql' no instalado. Limpieza de DB omitida."
  echo "    Ejecutar manualmente:"
  echo "    DELETE FROM ticket_validations WHERE ticket_id IN (SELECT id FROM tickets WHERE email LIKE '%@test.local');"
  echo "    DELETE FROM tickets WHERE email LIKE '%@test.local' AND (email LIKE 'load.test.%' OR email LIKE 'event.test.%');"
fi

echo ""
echo "══════════════════════════════════════════════════════"
echo "  TESTS COMPLETADOS — Resultados en: $RESULTS_DIR"
echo "══════════════════════════════════════════════════════"
