-- ====================================================================
-- ANANT PLATFORM: JAAP MALA SADHANA SCHEMA MIGRATION
-- File: supabase/migrations/20260912000003_jaap_mala_schema.sql
-- Covers: jaap_logs, jaap_goals, jaap_reminders with RLS & Indexes
-- ====================================================================

-- 1. JAAP SESSION LOGS
CREATE TABLE IF NOT EXISTS public.jaap_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mantra_name TEXT NOT NULL,
    deity_name TEXT,
    beads_count INTEGER NOT NULL DEFAULT 0,
    malas_completed INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. JAAP SADHANA GOALS (Day, Week, Month, Year)
CREATE TABLE IF NOT EXISTS public.jaap_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    target_malas INTEGER NOT NULL DEFAULT 16,
    target_beads INTEGER NOT NULL DEFAULT 1728,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_goal_period UNIQUE (user_id, period)
);

-- 3. JAAP SCHEDULED REMINDERS
CREATE TABLE IF NOT EXISTS public.jaap_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    time_of_day TEXT NOT NULL, -- e.g. '06:00'
    label TEXT NOT NULL DEFAULT 'Brahma Muhurta Japa',
    days_of_week TEXT[] DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    mantra TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR RAPID QUERYING
CREATE INDEX IF NOT EXISTS idx_jaap_logs_user_date ON public.jaap_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jaap_goals_user ON public.jaap_goals (user_id, period);
CREATE INDEX IF NOT EXISTS idx_jaap_reminders_user ON public.jaap_reminders (user_id, is_enabled);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.jaap_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jaap_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jaap_reminders ENABLE ROW LEVEL SECURITY;

-- jaap_logs policies
CREATE POLICY "Users can view their own jaap logs"
    ON public.jaap_logs FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can insert their own jaap logs"
    ON public.jaap_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- jaap_goals policies
CREATE POLICY "Users can manage their own jaap goals"
    ON public.jaap_goals FOR ALL
    USING (auth.uid() = user_id OR auth.role() = 'service_role')
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- jaap_reminders policies
CREATE POLICY "Users can manage their own jaap reminders"
    ON public.jaap_reminders FOR ALL
    USING (auth.uid() = user_id OR auth.role() = 'service_role')
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
