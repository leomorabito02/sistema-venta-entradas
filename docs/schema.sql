-- PostgreSQL Schema for Ticket Sales System (NeonDB)
-- Based on requirements: Documento de requerimientos Sistema de ventas seminario v1

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles: ADMIN, SELLER
-- User Status: PENDING, ACTIVE, DISABLED
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'SELLER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED')),
    password_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refresh Tokens for OWASP-compliant Authentication Rotation
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 digest of refresh token string
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Seller Quotas (Personal Presale Tickets)
CREATE TABLE IF NOT EXISTS seller_quotas (
    seller_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    assigned_quota INT NOT NULL DEFAULT 0 CHECK (assigned_quota >= 0),
    used_quota INT NOT NULL DEFAULT 0 CHECK (used_quota >= 0),
    used_free_quota INT NOT NULL DEFAULT 0 CHECK (used_free_quota >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_personal_quota_limit CHECK (used_quota <= assigned_quota)
);

-- Global Free Quota Pool (Presale Tickets pool accessible when seller quota is exhausted)
CREATE TABLE IF NOT EXISTS global_free_quotas (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton record
    total_free_quota INT NOT NULL DEFAULT 0 CHECK (total_free_quota >= 0),
    used_free_quota INT NOT NULL DEFAULT 0 CHECK (used_free_quota >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_global_free_quota_limit CHECK (used_free_quota <= total_free_quota)
);

-- Default Seller Quota Configuration (Equal initial quota for all sellers)
CREATE TABLE IF NOT EXISTS default_quota_configs (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    default_personal_quota INT NOT NULL DEFAULT 0 CHECK (default_personal_quota >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quota Modifications Audit Log (RNF-11.08)
CREATE TABLE IF NOT EXISTS quota_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID REFERENCES users(id), -- NULL if global free quota was modified
    quota_type VARCHAR(20) NOT NULL CHECK (quota_type IN ('PERSONAL', 'FREE')),
    previous_assigned INT NOT NULL CHECK (previous_assigned >= 0),
    new_assigned INT NOT NULL CHECK (new_assigned >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ticket Prices Configuration (RNF-06.03)
CREATE TABLE IF NOT EXISTS ticket_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_type VARCHAR(20) NOT NULL UNIQUE CHECK (ticket_type IN ('SIMPLE', 'CON_COMIDA')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Buyers Information (RF-07)
CREATE TABLE IF NOT EXISTS buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets / Bonos (RF-12, RF-18)
-- Statuses: VENDIDO, USADO_ENTRADA, USADO_COMIDA, ANULADO
-- Sale Sources: ANTICIPADA, PUERTA
-- Quota Sources: PERSONAL, LIBRE, NULL (for PUERTA)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
    public_token VARCHAR(64) NOT NULL UNIQUE,
    four_digit_code VARCHAR(4) NOT NULL,
    ticket_type VARCHAR(20) NOT NULL CHECK (ticket_type IN ('SIMPLE', 'CON_COMIDA')),
    sale_source VARCHAR(20) NOT NULL CHECK (sale_source IN ('ANTICIPADA', 'PUERTA')),
    quota_source VARCHAR(20) CHECK (quota_source IN ('PERSONAL', 'LIBRE')),
    price_paid NUMERIC(10, 2) NOT NULL CHECK (price_paid >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'VENDIDO' CHECK (status IN ('VENDIDO', 'USADO_ENTRADA', 'USADO_COMIDA', 'ANULADO')),
    buyer_id UUID NOT NULL REFERENCES buyers(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_quota_source_consistency CHECK (
        (sale_source = 'PUERTA' AND quota_source IS NULL) OR
        (sale_source = 'ANTICIPADA' AND quota_source IS NOT NULL)
    )
);

-- Ticket Validations and Event Audit Trail (RF-21.08, RF-24.10, RNF-11.02, RNF-11.03)
CREATE TABLE IF NOT EXISTS ticket_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    validation_type VARCHAR(20) NOT NULL CHECK (validation_type IN ('ENTRADA', 'COMIDA', 'ANULACION')),
    validated_by UUID NOT NULL REFERENCES users(id),
    previous_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    notes TEXT,
    validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Fast Query Performance & Constraints

-- Fast public lookup via non-enumerable token (RF-13.02)
CREATE INDEX IF NOT EXISTS idx_tickets_public_token ON tickets(public_token);

-- Uniqueness for 4-digit numeric code among active/valid tickets (RNF-06.02)
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_tickets_4digit_code 
ON tickets(four_digit_code) 
WHERE status IN ('VENDIDO', 'USADO_ENTRADA');

-- Indexes for sellers, buyers, and refresh tokens tracking
CREATE INDEX IF NOT EXISTS idx_tickets_seller_id ON tickets(seller_id);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer_id ON tickets(buyer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_validations_ticket_id ON ticket_validations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
