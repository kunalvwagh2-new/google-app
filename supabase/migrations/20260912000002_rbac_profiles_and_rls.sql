-- =============================================================================
-- Migration: 20260912000002_rbac_profiles_and_rls.sql
-- Application: Anant Spiritual Social Platform & Next.js / Supabase RBAC
-- Description: Complete Role-Based Access Control (RBAC) Schema
-- Roles:
--   1. 'admin': Full control (Manage users, Vercel/Supabase, DB structure, view all feedback)
--   2. 'temple_admin': Upload temple content, update events, upload media, test features
--   3. 'user': Regular user/tester (Test features, submit feedback, view uploaded content)
-- =============================================================================

BEGIN;

-- 1. Create Custom Enum for Roles (idempotent check)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'temple_admin', 'user');
  END IF;
END $$;

-- 2. Create User Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  temple_id TEXT, -- Associated temple identifier for temple_admin / content_creator
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy role lookups and multi-tenant filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_temple_id ON public.profiles(temple_id);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Security Definer Helper Functions (Bypasses RLS to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'::public.user_role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_temple_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin'::public.user_role, 'temple_admin'::public.user_role)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4. Profiles RLS Policies
DROP POLICY IF EXISTS "Allow individual read access" ON public.profiles;
CREATE POLICY "Allow individual read access" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin()
  );

DROP POLICY IF EXISTS "Allow individual self-update" ON public.profiles;
CREATE POLICY "Allow individual self-update" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id
  ) WITH CHECK (
    -- Devotees cannot elevate their own role
    auth.uid() = id AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

DROP POLICY IF EXISTS "Allow admin full access" ON public.profiles;
CREATE POLICY "Allow admin full access" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 5. Trigger to Automatically Create Profile on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
  -- Validate or fallback role from metadata
  BEGIN
    assigned_role := COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role);
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'user'::public.user_role;
  END;

  INSERT INTO public.profiles (id, full_name, email, avatar_url, role, temple_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Devotee User'),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    assigned_role,
    new.raw_user_meta_data->>'temple_id'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = timezone('utc'::text, now());
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. Tables Demonstrating RBAC Permission Enforcements
-- =============================================================================

-- Table A: Temple Content & Media (Uploaded by temple_admin / content_creator & admin)
CREATE TABLE IF NOT EXISTS public.temple_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'live_darshan', 'arti_video', 'sanctum_photo', 'announcement'
  media_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.temple_content ENABLE ROW LEVEL SECURITY;

-- Temple Content Policies:
-- 1. All authenticated users & testers can view published content
CREATE POLICY "Allow public read published temple content" ON public.temple_content
  FOR SELECT USING (is_published = true OR public.is_temple_admin());

-- 2. temple_admin & admin can insert and manage temple content
CREATE POLICY "Allow temple_admin and admin to insert temple content" ON public.temple_content
  FOR INSERT WITH CHECK (public.is_temple_admin());

CREATE POLICY "Allow temple_admin and admin to update temple content" ON public.temple_content
  FOR UPDATE USING (public.is_temple_admin());

CREATE POLICY "Allow temple_admin and admin to delete temple content" ON public.temple_content
  FOR DELETE USING (public.is_temple_admin());


-- Table B: Temple Events & Pooja Schedule (Updated by temple_admin & admin)
CREATE TABLE IF NOT EXISTS public.temple_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  capacity INT DEFAULT 500,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.temple_events ENABLE ROW LEVEL SECURITY;

-- Events Policies:
-- 1. Regular users/testers can view all events
CREATE POLICY "Allow all users to view events" ON public.temple_events
  FOR SELECT USING (true);

-- 2. Only temple_admin & admin can create/update events
CREATE POLICY "Allow temple_admin and admin to manage events" ON public.temple_events
  FOR ALL USING (public.is_temple_admin());


-- Table C: Feedback & Testing Reports (Submitted by users; ONLY viewable by admin)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  category TEXT DEFAULT 'feature_testing', -- 'bug_report', 'feature_request', 'darshan_feedback'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending_review', -- 'pending_review', 'resolved', 'archived'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Feedback Policies:
-- 1. Any authenticated user (including tester and regular user) can submit feedback
CREATE POLICY "Allow any user to submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- 2. Users can view their own submitted feedback
CREATE POLICY "Allow users to view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);

-- 3. ONLY admin has full control: view ALL feedback, update resolution notes, and delete
CREATE POLICY "Allow admin full access to feedback" ON public.feedback
  FOR ALL USING (public.is_admin());

COMMIT;
