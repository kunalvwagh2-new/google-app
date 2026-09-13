-- =============================================================================
-- Migration: 20260912000001_init_anant_schema.sql
-- Application: Anant (अनंत) - Dedicated Spiritual & Hindu Religion Social Platform
-- Target: PostgreSQL 14+ / Supabase with PostGIS
-- =============================================================================

BEGIN;

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Custom Enumerations
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_role') THEN
        CREATE TYPE tenant_role AS ENUM (
            'ADMIN',
            'MARKETING',
            'POOJARI_RITUALS',
            'DONATIONS_FINANCE',
            'MEDIA'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trust_verification_status') THEN
        CREATE TYPE trust_verification_status AS ENUM (
            'PENDING_VERIFICATION',
            'APPROVED',
            'REJECTED',
            'EXPIRED',
            'RENEWAL_DUE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_category') THEN
        CREATE TYPE media_category AS ENUM (
            'ARTI',
            'STOTRA',
            'BHAJAN',
            'SHLOKA',
            'CHATURMAS_BOOK',
            'LIVE_DARSHAN'
        );
    END IF;
END $$;

-- 3. Deities Table (Sacred Archetypes & Iconography)
CREATE TABLE IF NOT EXISTS deities (
    id VARCHAR(64) PRIMARY KEY,
    name_en VARCHAR(128) NOT NULL,
    name_mr VARCHAR(128) NOT NULL,
    name_hi VARCHAR(128) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    icon_url TEXT,
    banner_url TEXT,
    associated_temples_count INT DEFAULT 0,
    popular_mantras TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Temples Table (With PostGIS Geography for Location Proximity)
CREATE TABLE IF NOT EXISTS temples (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    deity_id VARCHAR(64) REFERENCES deities(id) ON DELETE SET NULL,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    geog geography(Point, 4326) NOT NULL, -- WGS84 coordinates: Point(longitude, latitude)
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    cover_image_url TEXT,
    live_darshan_stream_url TEXT,
    darshan_timings VARCHAR(128),
    pooja_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    gov_reg_number VARCHAR(128) UNIQUE NOT NULL,
    whatsapp_number VARCHAR(32),
    social_links JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PostGIS Spatial Index for lightning-fast geo-proximity darshan searches
CREATE INDEX IF NOT EXISTS idx_temples_geog ON temples USING GIST (geog);
CREATE INDEX IF NOT EXISTS idx_temples_city ON temples (city);
CREATE INDEX IF NOT EXISTS idx_temples_deity ON temples (deity_id);

-- 5. Temple Trusts Table (Legal Compliance, Verification Queue, 5-Seat Limit)
CREATE TABLE IF NOT EXISTS temple_trusts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id VARCHAR(64) REFERENCES temples(id) ON DELETE CASCADE,
    legal_name VARCHAR(256) NOT NULL,
    gov_reg_number VARCHAR(128) UNIQUE NOT NULL,
    charity_commissioner_office VARCHAR(128) NOT NULL,
    certificate_url TEXT NOT NULL,
    registration_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    tax_80g_number VARCHAR(128),
    verification_status trust_verification_status DEFAULT 'PENDING_VERIFICATION',
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    rejection_reason TEXT,
    trustee_roster JSONB NOT NULL DEFAULT '[]'::JSONB, -- List of registered trustees
    last_monthly_attestation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trust Members Table (Strict 5-Seat Multi-User RBAC)
CREATE TABLE IF NOT EXISTS trust_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trust_id UUID REFERENCES temple_trusts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role tenant_role NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    email VARCHAR(256) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_trust_user UNIQUE (trust_id, user_id)
);

-- Trigger to guarantee strict maximum 5 active seats per temple trust
CREATE OR REPLACE FUNCTION enforce_trust_seat_limit()
RETURNS TRIGGER AS $$
DECLARE
    active_count INT;
BEGIN
    SELECT COUNT(*) INTO active_count
    FROM trust_members
    WHERE trust_id = NEW.trust_id AND is_active = TRUE;

    IF active_count >= 5 THEN
        RAISE EXCEPTION 'Seat limit reached: Temple Trusts are strictly capped at 5 active team seats (Marketing, Poojari, Donations, Media, Admin).';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_trust_seats ON trust_members;
CREATE TRIGGER trg_check_trust_seats
BEFORE INSERT ON trust_members
FOR EACH ROW EXECUTE FUNCTION enforce_trust_seat_limit();

-- 7. Devotional Media Library (Artis, Stotras, Bhajans, Chaturmas Books)
CREATE TABLE IF NOT EXISTS devotional_media (
    id VARCHAR(64) PRIMARY KEY,
    category media_category NOT NULL,
    deity_id VARCHAR(64) REFERENCES deities(id) ON DELETE SET NULL,
    title_en VARCHAR(256) NOT NULL,
    title_mr VARCHAR(256) NOT NULL,
    title_hi VARCHAR(256) NOT NULL,
    views_count INT DEFAULT 0,
    duration VARCHAR(32),
    audio_url TEXT,
    video_url TEXT,
    pdf_url TEXT,
    pdf_page_count INT,
    lyrics JSONB NOT NULL DEFAULT '{"mr":"","hi":"","en":""}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_category ON devotional_media (category);
CREATE INDEX IF NOT EXISTS idx_media_deity ON devotional_media (deity_id);

-- 8. OTP Verifications & Security Rate-Limiting Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile VARCHAR(32) NOT NULL,
    otp_hash VARCHAR(256) NOT NULL,
    attempts INT DEFAULT 0,
    ip_address VARCHAR(64),
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_verifications (mobile);

-- 9. PostGIS Spatial Stored Procedure: Find Nearest Temples
CREATE OR REPLACE FUNCTION find_nearest_temples(
    user_lat DOUBLE PRECISION,
    user_lon DOUBLE PRECISION,
    max_distance_km DOUBLE PRECISION DEFAULT 100.0
)
RETURNS TABLE (
    id VARCHAR(64),
    name VARCHAR(256),
    deity_id VARCHAR(64),
    city VARCHAR(128),
    state VARCHAR(128),
    address TEXT,
    distance_km DOUBLE PRECISION,
    is_verified BOOLEAN,
    followers_count INT,
    cover_image_url TEXT,
    live_darshan_stream_url TEXT,
    darshan_timings VARCHAR(128),
    pooja_services TEXT[],
    gov_reg_number VARCHAR(128)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.deity_id,
        t.city,
        t.state,
        t.address,
        ROUND((ST_Distance(t.geog, ST_MakePoint(user_lon, user_lat)::geography) / 1000.0)::numeric, 1)::DOUBLE PRECISION AS distance_km,
        t.is_verified,
        t.followers_count,
        t.cover_image_url,
        t.live_darshan_stream_url,
        t.darshan_timings,
        t.pooja_services,
        t.gov_reg_number
    FROM temples t
    WHERE ST_DWithin(t.geog, ST_MakePoint(user_lon, user_lat)::geography, max_distance_km * 1000.0)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

COMMIT;
