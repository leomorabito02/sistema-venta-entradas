# Tests de Carga y Concurrencia

Valida que el sistema tolera carga real en los endpoints críticos y detecta condiciones de carrera.

## Estructura

```
tests/load/
├── scripts/
│   ├── setup_fixtures.js   # Setup: crea N tickets vía API y genera seed_tokens.json
│   ├── validate_entry.js   # 60 VUs, validación de entrada
│   ├── validate_food.js    # 10 VUs, mismo ticket → solo 1 debe ganar
│   ├── create_ticket.js    # 30 VUs, emisión masiva
│   └── spike_public.js     # 0→200 VUs, endpoint público
├── fixtures/
│   └── seed_tokens.json    # Generado automáticamente por setup_fixtures.js
├── gen_fixtures/
│   └── main.go             # Generador alternativo (DB directa, uso manual)
├── results/                # JSON de resultados por ejecución (auto-creado)
├── .env.test.example       # Template de variables de entorno
└── run_all.sh              # Orquestador principal
```

---

## Pre-requisitos

### k6

```bash
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | \
  sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

### psql

```bash
sudo apt-get install -y postgresql-client
```

---

## Ejecución

### 1. Configurar variables de entorno

```bash
cp tests/load/.env.test.example tests/load/.env.test
# Editar tests/load/.env.test con DATABASE_URL real y JWT_TOKEN (o dejarlo vacío para auto-generar)
```

### 2. Ejecutar todos los escenarios

```bash
cd tests/load
bash run_all.sh
```

El orquestador ejecuta automáticamente:
1. Health check del backend
2. **Setup**: crea tickets frescos vía API y genera `fixtures/seed_tokens.json`
3. Escenario 1: Validate Entry (60 VUs)
4. Escenario 2: Validate Food (auto-detecta FOOD_TOKEN)
5. Escenario 3: Create Ticket (30 VUs)
6. Escenario 4: Spike Test (0→200 VUs)
7. Verificación post-test de duplicados en DB

### 3. Opciones

```bash
# Saltar la creación de fixtures (usar los existentes)
SKIP_SETUP=1 bash run_all.sh

# Cambiar la cantidad de tickets creados en setup
FIXTURE_COUNT=100 bash run_all.sh

# Pasar JWT manualmente
JWT_TOKEN="eyJ..." bash run_all.sh
```

### 4. Ejecutar un escenario individual

```bash
cd tests/load

k6 run \
  -e BASE_URL=http://localhost:8080 \
  -e JWT_TOKEN=eyJhbGci... \
  scripts/validate_entry.js
```

---

## Race Detector (Go)

```bash
cd backend

DATABASE_URL="<dsn>" \
JWT_SECRET="<secret>" \
go test -race -v -count=1 -timeout=120s ./internal/services/... -run "TestDouble"
```

**Salida esperada:**
```
--- PASS: TestDoubleValidateEntry (1.23s)
--- PASS: TestDoubleValidateFood (0.85s)
```

Si hay data race, el detector imprimirá `DATA RACE` en stderr y el test fallará.

---

## Métricas de Aceptación

| Métrica | Umbral |
|---------|--------|
| p95 latencia en `/validate` | < 200ms |
| Error rate total | < 1% |
| Dobles validaciones exitosas | **0** |
| `four_digit_code` duplicados en DB | **0** |
| 500s bajo spike | **0** |

> **Nota**: `double_validation_successes` detecta dobles dentro del mismo VU.
> La detección cross-VU se realiza con la verificación SQL post-test.

---

## Verificación manual post-test (SQL)

```sql
-- Duplicados de four_digit_code (deben ser 0)
SELECT four_digit_code, COUNT(*)
FROM tickets
GROUP BY four_digit_code
HAVING COUNT(*) > 1;

-- Tickets en estado inválido (VENDIDO → USADO_COMIDA sin pasar por USADO_ENTRADA)
SELECT t.id, t.status, t.ticket_type
FROM tickets t
WHERE t.status = 'USADO_COMIDA'
  AND NOT EXISTS (
    SELECT 1 FROM ticket_validations tv
    WHERE tv.ticket_id = t.id
      AND tv.validation_type = 'ENTRADA'
  );
```
