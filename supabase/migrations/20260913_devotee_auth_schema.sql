-- =========================================================================
-- ANANT (अनंत) SPIRITUAL SOCIAL PLATFORM - DEVOTEE AUTH & SANKALP SCHEMA
-- =========================================================================

-- 1. Profiles Table for Devotee Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'MR' CHECK (preferred_language IN ('MR', 'HI', 'EN', 'SA', 'GU', 'TA', 'TE')),
  avatar_url TEXT,
  streak_days INTEGER DEFAULT 1,
  total_malas_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on phone number for fast OTP lookup
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_lang ON public.profiles(preferred_language);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert/update their own profile" ON public.profiles
  FOR ALL USING (true);


-- 2. Jaap Sessions Table for Sankalp History
CREATE TABLE IF NOT EXISTS public.jaap_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mantra_name TEXT NOT NULL,
  deity_name TEXT NOT NULL,
  beads_count INTEGER DEFAULT 108,
  malas_completed INTEGER DEFAULT 1,
  duration_seconds INTEGER DEFAULT 360,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index on user_id for fast sankalp history queries
CREATE INDEX IF NOT EXISTS idx_jaap_sessions_user ON public.jaap_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_jaap_sessions_timestamp ON public.jaap_sessions(timestamp DESC);

-- Enable RLS for jaap_sessions
ALTER TABLE public.jaap_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jaap sessions" ON public.jaap_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own jaap sessions" ON public.jaap_sessions
  FOR INSERT WITH CHECK (true);
