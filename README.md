# Sistema de Venta de Entradas

Sistema fullstack para la gestión y venta de entradas a eventos, con validación QR, control de cupos y autenticación segura.

---

## Índice

- [Descripción](#descripción)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Levantar la aplicación](#levantar-la-aplicación)
  - [Con Docker Compose (recomendado)](#con-docker-compose-recomendado)
  - [Desarrollo local (sin Docker)](#desarrollo-local-sin-docker)
- [Variables de entorno](#variables-de-entorno)
- [Tests](#tests)
  - [Backend — Unit Tests](#backend--unit-tests)
  - [Backend — Race Detector](#backend--race-detector)
  - [Tests de Carga (k6)](#tests-de-carga-k6)
  - [Security Testing](#security-testing)
- [CI/CD](#cicd)
- [Documentación de la API](#documentación-de-la-api)

---

## Descripción

Plataforma que permite:

- **Emisión de entradas** con código QR único y código de 4 dígitos.
- **Validación de entrada** y **consumo de servicio de comida** en puerta, con protección ante doble validación concurrente.
- **Gestión de cupos** por tipo de entrada, con control de stock atómico.
- **Autenticación** con JWT y Firebase (Google Sign-In).
- **Administración** de usuarios, precios y reportes.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Go 1.25 — net/http, GORM, JWT, Swagger |
| Base de datos | PostgreSQL 15 |
| Frontend | Angular 19 — TypeScript, Firebase |
| Containerización | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Seguridad | gosec (SAST), govulncheck (SCA), OWASP ZAP (DAST), Gitleaks |
| Tests de carga | k6 |
| Calidad de código | SonarQube |

---

## Arquitectura

```
sistema-venta-entradas/
├── backend/                  # API REST en Go
│   ├── cmd/
│   │   ├── server/           # Entrypoint del servidor HTTP
│   │   └── migrate/          # Entrypoint de migraciones
│   ├── internal/
│   │   ├── controllers/      # Handlers HTTP
│   │   ├── services/         # Lógica de negocio
│   │   ├── repository/       # Acceso a datos (GORM)
│   │   ├── models/           # Entidades del dominio
│   │   ├── middlewares/      # Auth, CORS, rate limiting
│   │   ├── dto/              # Request/Response objects
│   │   ├── routes/           # Registro de rutas
│   │   ├── security/         # JWT, Firebase
│   │   ├── cache/            # Caché en memoria
│   │   └── views/            # Templates de respuesta
│   └── scripts/
│       └── security-test.sh  # SAST + SCA + DAST orquestado
├── frontend/                 # SPA Angular 19
│   └── src/app/
│       ├── core/             # Guards, interceptors, servicios globales
│       ├── features/         # Módulos funcionales (tickets, validación, admin)
│       └── shared/           # Componentes reutilizables
├── tests/
│   └── load/                 # Escenarios k6 (concurrencia y carga)
├── docs/                     # Esquema SQL y documentación adicional
└── docker-compose.yml
```

---

## Requisitos previos

| Herramienta | Versión mínima | Uso |
|-------------|---------------|-----|
| Docker + Docker Compose | 24+ | Entorno completo |
| Go | 1.25 | Desarrollo backend |
| Node.js | 22 | Desarrollo frontend |
| pnpm | 9+ | Gestión de paquetes frontend |
| PostgreSQL | 15 | Base de datos (dev local) |
| k6 | latest | Tests de carga (opcional) |

---

## Levantar la aplicación

### Con Docker Compose (recomendado)

> **Nota:** El stack de Docker no incluye una instancia de PostgreSQL. La `DATABASE_URL` debe apuntar a una base de datos externa accesible desde los contenedores.

**1. Configurar variables de entorno del backend:**

```bash
cp backend/.env.example backend/.env
# Editar backend/.env con los valores reales
```

**2. Levantar los servicios:**

```bash
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Backend API | http://localhost:8080 |
| Frontend SPA | http://localhost:80 |
| Health check | http://localhost:8080/health |

**3. Detener los servicios:**

```bash
docker compose down
```

---

### Desarrollo local (sin Docker)

#### Backend

```bash
cd backend

# Instalar dependencias
go mod download

# Ejecutar migraciones
go run cmd/migrate/main.go

# Iniciar servidor
go run cmd/server/main.go
```

El servidor escucha en `http://localhost:8080`.

#### Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm start
```

La SPA estará disponible en `http://localhost:4200`.

---

## Variables de entorno

### Backend (`backend/.env`)

Copiar desde `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | DSN de PostgreSQL | ✅ |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | ✅ |
| `JWT_ACCESS_EXPIRATION_MINUTES` | Duración del access token (ej: `15`) | ✅ |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS | ✅ |
| `INITIAL_ADMIN_EMAIL` | Email del usuario administrador inicial | ✅ |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase | ✅ |
| `FIREBASE_CREDENTIALS_JSON` | JSON de credenciales de servicio Firebase | ✅ |
| `PORT` | Puerto HTTP del servidor (default: `8080`) | ❌ |

> ⚠️ Nunca commitear el archivo `.env`. Está incluido en `.gitignore`.

---

## Tests

### Backend — Unit Tests

Ejecutar todos los tests unitarios:

```bash
cd backend
go test ./...
```

Con reporte de cobertura:

```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

Solo los tests de servicios (lógica de negocio):

```bash
go test -v ./internal/services/...
```

Solo los tests de modelos:

```bash
go test -v ./internal/models/...
```

---

### Backend — Race Detector

Detecta condiciones de carrera en la validación concurrente de entradas:

```bash
cd backend

DATABASE_URL="<dsn>" \
JWT_SECRET="<secret>" \
go test -race -v -count=1 -timeout=120s ./internal/services/... -run "TestDouble"
```

Salida esperada:

```
--- PASS: TestDoubleValidateEntry (1.23s)
--- PASS: TestDoubleValidateFood (0.85s)
```

Si existe una data race, el detector imprimirá `DATA RACE` en stderr y el test fallará.

---

### Tests de Carga (k6)

Validan tolerancia bajo carga real y detectan data races a nivel de sistema.

**Pre-requisitos:**

```bash
# Instalar k6
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | \
  sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Instalar cliente PostgreSQL
sudo apt-get install -y postgresql-client
```

**Configurar y ejecutar:**

```bash
cp tests/load/.env.test.example tests/load/.env.test
# Editar .env.test con DATABASE_URL y JWT_TOKEN

cd tests/load
bash run_all.sh
```

El orquestador ejecuta automáticamente 4 escenarios:

| Escenario | Script | VUs |
|-----------|--------|-----|
| Validación de entrada | `validate_entry.js` | 60 |
| Validación de comida (anti-doble) | `validate_food.js` | 10 |
| Emisión masiva de tickets | `create_ticket.js` | 30 |
| Spike test (endpoint público) | `spike_public.js` | 0 → 200 |

**Métricas de aceptación:**

| Métrica | Umbral |
|---------|--------|
| p95 latencia en `/validate` | < 200ms |
| Error rate total | < 1% |
| Dobles validaciones exitosas | **0** |
| Códigos de 4 dígitos duplicados en DB | **0** |
| HTTP 500s bajo spike | **0** |

Ver documentación detallada en [`tests/load/README.md`](tests/load/README.md).

---

### Security Testing

Ejecuta SAST, SCA y DAST de forma encadenada sobre el backend:

```bash
cd backend
bash scripts/security-test.sh
```

| Etapa | Herramienta | Descripción |
|-------|------------|-------------|
| SAST | `gosec` | Análisis estático de código Go |
| SCA | `govulncheck` | Vulnerabilidades en dependencias |
| DAST | OWASP ZAP | Escaneo dinámico sobre la API (OpenAPI spec) |

- El pipeline falla si SAST detecta vulnerabilidades de severidad **HIGH**.
- Los reportes se generan en:
  - `backend/sast_report.json`
  - `backend/sca_report.txt`
  - `backend/zap_report.html`

---

## CI/CD

El pipeline de GitHub Actions (`.github/workflows/pipeline.yml`) se ejecuta en cada push o PR a `main`, `testing` y `develop`:

```
CI
├── Secrets Scan       → Gitleaks
├── Backend            → Build + Unit Tests + Coverage
└── Frontend           → Build + Unit Tests (ChromeHeadless)

CD (solo en main / testing)
├── Security           → SAST + SCA + DAST
├── Build & Push       → Docker image → Artifact Registry (GCP)
└── Deploy             → Cloud Run (GCP)
```

---

## Documentación de la API

La API expone documentación Swagger/OpenAPI generada con `swag`.

**Generar/actualizar la spec:**

```bash
cd backend
go install github.com/swaggo/swag/cmd/swag@latest
swag init -g cmd/server/main.go -o docs
```

**Acceder en local:**

```
http://localhost:8080/swagger/index.html
```
