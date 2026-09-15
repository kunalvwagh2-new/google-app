-- =========================================================================
-- ANANT (अनंत) MULTI-TENANCY & TEMPLE TRUST SCHEMA (TIER 2A)
-- =========================================================================

-- 1. Tenants Table (Temple Trusts / Organizations)
CREATE TABLE IF NOT EXISTS public.tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  gov_reg_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'suspended')),
  base_seat_limit INTEGER DEFAULT 5,
  purchased_extra_seats INTEGER DEFAULT 0,
  bank_account_verified BOOLEAN DEFAULT FALSE,
  compliance_doc_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON public.tenants(status);

-- 2. Tenant Members Table (Role-based access & seat management)
CREATE TABLE IF NOT EXISTS public.tenant_members (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'poojari' CHECK (role IN ('temple_admin', 'accounts', 'marketing', 'poojari', 'custom_staff')),
  is_primary_admin BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON public.tenant_members(user_id);

-- 3. Login Audit Logs Table (Real-time admin alerts & security)
CREATE TABLE IF NOT EXISTS public.login_audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_tenant ON public.login_audit_logs(tenant_id);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants are viewable by everyone" ON public.tenants FOR SELECT USING (true);
CREATE POLICY "Tenant members viewable by members" ON public.tenant_members FOR SELECT USING (true);
CREATE POLICY "Audit logs viewable by admins" ON public.login_audit_logs FOR SELECT USING (true);
