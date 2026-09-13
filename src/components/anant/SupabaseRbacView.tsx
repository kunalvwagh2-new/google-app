import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Database,
  Server,
  UploadCloud,
  Calendar,
  MessageSquarePlus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Flame,
  FileText,
  Terminal,
  PhoneCall,
  Building,
} from 'lucide-react';
import {
  UserRole,
  ROLE_DEFINITIONS,
  ROLE_PERMISSIONS,
  MOCK_TEST_PROFILES,
  PROTECTED_ROUTES,
  validateRouteAccess,
  hasPermission,
  PermissionAction,
} from '../../lib/supabase-rbac.ts';

const SUPABASE_SQL_CODE = `-- =============================================================================
-- Migration: 20260912000002_rbac_profiles_and_rls.sql
-- Application: Anant Spiritual Social Platform & Next.js / Supabase RBAC
-- Description: Complete Role-Based Access Control (RBAC) Schema
-- Roles:
--   1. 'admin': Full control (Manage users, Vercel/Supabase, DB structure, view all feedback)
--   2. 'temple_admin': Upload temple content, update events, upload media, test features
--   3. 'user': Regular user/tester (Test features, submit feedback, view uploaded content)
-- =============================================================================

BEGIN;

-- 1. Create Custom Enum for Roles
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
  temple_id TEXT, -- Associated temple identifier for temple_admin
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Security Definer Helper Functions (Avoids RLS infinite recursion)
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
CREATE POLICY "Allow individual read access" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow individual self-update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin()));

CREATE POLICY "Allow admin full access" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 5. Trigger to Automatically Create Profile on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. Tables Demonstrating RBAC Permission Enforcements
-- =============================================================================

-- Table A: Temple Content (Managed by temple_admin & admin; Viewed by user)
CREATE TABLE IF NOT EXISTS public.temple_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  media_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.temple_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published temple content" ON public.temple_content
  FOR SELECT USING (is_published = true OR public.is_temple_admin());

CREATE POLICY "Allow temple_admin and admin to manage temple content" ON public.temple_content
  FOR ALL USING (public.is_temple_admin());

-- Table B: Feedback (Submitted by users; ONLY viewable by admin)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  category TEXT DEFAULT 'feature_testing',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending_review',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow any user to submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow admin full access to feedback" ON public.feedback
  FOR ALL USING (public.is_admin());

COMMIT;`;

const MIDDLEWARE_CODE = `// =============================================================================
// File: src/middleware.ts
// Next.js Middleware for Role-Based Access Control (RBAC) with Supabase
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // 1. Initialize Supabase Server Client with Next.js Cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Fetch authenticated user session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Query role from public.profiles table
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role || null;
  }

  const { pathname } = request.nextUrl;

  // RULE 1: Admin Only Routes (/admin/* and /feedback/admin/*)
  // Full control: Manage users, modify DB structure, access Vercel/Supabase, view all feedback
  if ((pathname.startsWith('/admin') || pathname.startsWith('/feedback/admin')) && role !== 'admin') {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('error', 'unauthorized');
    redirectUrl.searchParams.set('required_role', 'admin');
    redirectUrl.searchParams.set('redirected_from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // RULE 2: Temple Admin & Content Creator Routes (/temple-manage/* & /content-creator/*)
  // Permissions: Upload temple content, update events, upload media, test features
  if (
    (pathname.startsWith('/temple-manage') || pathname.startsWith('/content-creator')) &&
    !['admin', 'temple_admin'].includes(role as string)
  ) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('error', 'unauthorized');
    redirectUrl.searchParams.set('required_role', 'temple_admin');
    redirectUrl.searchParams.set('redirected_from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // RULE 3: Tester & Devotee Authenticated Routes (/feedback/submit)
  // Permissions: Test features, submit feedback, view uploaded content
  if (pathname.startsWith('/feedback/submit') && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirected_from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Inject current user role into request headers for downstream server components
  if (role) {
    response.headers.set('x-user-role', role);
    response.headers.set('x-user-id', user?.id || '');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/feedback/admin/:path*',
    '/temple-manage/:path*',
    '/content-creator/:path*',
    '/feedback/submit',
  ],
};`;

const HELPERS_CODE = `// =============================================================================
// File: src/lib/supabase-rbac.ts
// Server Action & Route Handler Role Verification Helpers
// =============================================================================

export type UserRole = 'admin' | 'temple_admin' | 'user';

export async function requireUserWithRole(
  supabaseClient: any,
  allowedRoles: UserRole[]
) {
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    throw new Error('UNAUTHORIZED: Authentication required.');
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('FORBIDDEN: User profile not found.');
  }

  const role: UserRole = profile.role || 'user';
  if (!allowedRoles.includes(role)) {
    throw new Error(
      \`FORBIDDEN: Insufficient permissions. Requires [\${allowedRoles.join(', ')}], current role is '\${role}'.\`
    );
  }

  return { user, profile };
}

// Convenience helper for Admin Actions
export async function requireAdmin(supabaseClient: any) {
  return requireUserWithRole(supabaseClient, ['admin']);
}

// Convenience helper for Temple Management
export async function requireTempleAdmin(supabaseClient: any) {
  return requireUserWithRole(supabaseClient, ['admin', 'temple_admin']);
}`;

const STEP_11_ENV_CODE = `# =============================================================================
# Step 11: .env.local Configuration Template
# Connect Anant Database Schema to a live Supabase / PostgreSQL instance
# =============================================================================

# PostgreSQL Direct Connection String (Used by Prisma, Drizzle, or raw pg/node-postgres)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"

# Supabase API Endpoint & Public Anonymous Key (Used client-side in Next.js / React)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Supabase Service Role Secret Key (Server-Only: Bypasses RLS for DB Seeding & Super Admin)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# App URL (For OAuth redirects & mobile magic link deep links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"`;

const STEP_11_SEED_CODE = `/**
 * scripts/seed-db.js
 * Supabase Database Initialization & Seeding Script
 * 
 * Execution:
 *   node scripts/seed-db.js
 * Or with Supabase direct migration:
 *   npx supabase db push && node scripts/seed-db.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedDatabase() {
  console.log('🕉️ Starting Supabase Database Seed for Anant Platform...');

  // 1. Seed 3 Core Deities (Lord Ganesh, Lord Shiva, Lord Hanuman)
  const { data: deities, error: deityErr } = await supabase.from('deities').upsert([
    {
      id: 'lord_ganesh',
      name_en: 'Lord Ganesh (Vighnaharta)',
      name_mr: 'श्री गणेश (विघ्नहर्ता)',
      name_hi: 'भगवान गणेश (विघ्नहर्ता)',
      title: 'Remover of Obstacles & Master of Wisdom',
      icon_url: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'lord_shiva',
      name_en: 'Lord Shiva (Mahadev)',
      name_mr: 'भगवान शिव (महादेव)',
      name_hi: 'भगवान शिव (महादेव)',
      title: 'Supreme Ascetic, Transformer & Cosmic Lord',
      icon_url: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'lord_hanuman',
      name_en: 'Lord Hanuman (Maruti)',
      name_mr: 'श्री हनुमान (बजरंगबली)',
      name_hi: 'भगवान हनुमान (बजरंगबली)',
      title: 'Embodiment of Devotion, Courage & Strength',
      icon_url: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=200&auto=format&fit=crop&q=80',
    },
  ]);
  if (deityErr) console.warn('⚠️ Deity seed warning:', deityErr.message);
  else console.log('✅ 3 Deities seeded successfully.');

  // 2. Seed 5 Sample Temples with PostGIS Coordinates (Pune, Mumbai, Nashik, Goa)
  const { data: temples, error: templeErr } = await supabase.from('temples').upsert([
    {
      id: 'temple_dagdusheth',
      name: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
      deity_id: 'lord_ganesh',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Budhwar Peth, Shivaji Road, Pune 411002',
      latitude: 18.5173,
      longitude: 73.8553,
      darshan_open_time: '06:00',
      darshan_close_time: '22:30',
      is_live_darshan_active: true,
      is_verified_trust: true,
      trust_reg_number: 'E-1244/PUNE/1893',
    },
    {
      id: 'temple_siddhivinayak',
      name: 'Shree Siddhivinayak Ganapati Mandir',
      deity_id: 'lord_ganesh',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'SK Bole Marg, Prabhadevi, Mumbai 400028',
      latitude: 19.0169,
      longitude: 72.8304,
      darshan_open_time: '05:30',
      darshan_close_time: '21:45',
      is_live_darshan_active: true,
      is_verified_trust: true,
      trust_reg_number: 'F-1933/MUMBAI/1901',
    },
    {
      id: 'temple_trimbakeshwar',
      name: 'Trimbakeshwar Shiva Jyotirlinga Mandir',
      deity_id: 'lord_shiva',
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'Trimbak, Nashik District 422212',
      latitude: 19.9324,
      longitude: 73.5309,
      darshan_open_time: '05:30',
      darshan_close_time: '21:00',
      is_live_darshan_active: true,
      is_verified_trust: true,
      trust_reg_number: 'A-490/NASHIK/1954',
    },
    {
      id: 'temple_shantadurga',
      name: 'Shree Shantadurga Devasthan',
      deity_id: 'lord_shiva',
      city: 'Goa (Ponda)',
      state: 'Goa',
      address: 'Kavlem, Ponda Taluka, North Goa 403401',
      latitude: 15.3976,
      longitude: 73.9934,
      darshan_open_time: '06:00',
      darshan_close_time: '21:00',
      is_live_darshan_active: true,
      is_verified_trust: true,
      trust_reg_number: 'GOA-DEV-1577',
    },
    {
      id: 'temple_maruti_pune',
      name: 'Pasodya Maruti Mandir (Historic Peeth)',
      deity_id: 'lord_hanuman',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Budhwar Peth, Laxmi Road, Pune 411002',
      latitude: 18.5165,
      longitude: 73.8569,
      darshan_open_time: '05:00',
      darshan_close_time: '22:00',
      is_live_darshan_active: false,
      is_verified_trust: true,
      trust_reg_number: 'PUNE-H-8821',
    },
  ]);
  if (templeErr) console.warn('⚠️ Temple seed warning:', templeErr.message);
  else console.log('✅ 5 Temples mapped with PostGIS coordinates seeded.');

  // 3. Seed Devotional Stotras, Artis & Chaturmas Books
  const { data: media, error: mediaErr } = await supabase.from('devotional_media').upsert([
    {
      id: 'stotra_sukhkarta',
      category: 'arti',
      deity_id: 'lord_ganesh',
      title_en: 'Sukhkarta Dukhharta Aarti (Samarth Ramdas)',
      title_mr: 'सुखकर्ता दुःखहर्ता वार्ता विघ्नाची',
      title_hi: 'सुखकर्ता दुखहर्ता (श्री गणेश आरती)',
      duration: '4:15',
      audio_url: 'https://archive.org/download/ganesh_sukhkarta_aarti.mp3',
      pdf_url: 'https://anant.org/docs/sukhkarta_dukkharta_lyrics.pdf',
      pdf_page_count: 2,
    },
    {
      id: 'stotra_hanuman_chalisa',
      category: 'stotra',
      deity_id: 'lord_hanuman',
      title_en: 'Shri Hanuman Chalisa (Goswami Tulsidas)',
      title_mr: 'श्री हनुमान चालीसा (४० चौपाई)',
      title_hi: 'श्री हनुमान चालीसा (अवधी / हिंदी)',
      duration: '9:40',
      audio_url: 'https://archive.org/download/hanuman_chalisa_chant.mp3',
      pdf_url: 'https://anant.org/docs/hanuman_chalisa_awadhi_hindi.pdf',
      pdf_page_count: 6,
    },
    {
      id: 'book_chaturmas_shravan',
      category: 'chaturmas_book',
      deity_id: 'lord_shiva',
      title_en: 'Shiv Chaturmas Vrat Mahatmya & Bilvashtakam Book',
      title_mr: 'शिव चातुर्मास व्रत कथा व पोथी',
      title_hi: 'शिव चातुर्मास व्रत कथा एवं पूजन विधि',
      duration: 'Reading (68 Pages)',
      pdf_url: 'https://anant.org/docs/chaturmas_shiva_vrat_katha.pdf',
      pdf_page_count: 68,
    },
  ]);
  if (mediaErr) console.warn('⚠️ Devotional media seed warning:', mediaErr.message);
  else console.log('✅ Devotional Artis, Stotras & Chaturmas Books seeded.');

  console.log('✨ All Anant initial seed data populated in Supabase!');
}

seedDatabase();`;

const STEP_12_AUTH_CODE = `// =============================================================================
// File: src/lib/supabase-auth-flow.ts
// Step 12: End-to-End Authentication & Mobile OTP + Trust Onboarding
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 1. Mobile OTP Authentication (SMS via Supabase / Twilio Gateway)
export async function sendMobileOtp(phoneNumber: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Calls Supabase Phone Auth (E.164 formatted: e.g. +919822011223)
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
    options: {
      channel: 'sms',
    },
  });

  if (error) throw new Error(error.message);
  return { success: true, message: 'OTP sent to mobile phone via SMS gateway.' };
}

// 2. Verify Mobile OTP
export async function verifyMobileOtp(phoneNumber: string, token: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token,
    type: 'sms',
  });

  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}

// 3. Upload Govt Trust Certificate to Supabase Storage Bucket
export async function uploadTrustCertificate(file: File, trustRegNumber: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const cleanReg = trustRegNumber.replace(/[^a-zA-Z0-9]/g, '_');
  const path = \`trust-certificates/\${cleanReg}_\${Date.now()}.pdf\`;

  const { data, error } = await supabase.storage
    .from('trust-documents')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('trust-documents')
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}`;

export function SupabaseRbacView({
  onOpenMobileAuth,
  onOpenTrustRegister,
  onOpenSuperAdminQueue,
}: {
  onOpenMobileAuth?: () => void;
  onOpenTrustRegister?: () => void;
  onOpenSuperAdminQueue?: () => void;
}) {
  // Active Simulated Persona: 'admin' | 'temple_admin' | 'user'
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const currentProfile = MOCK_TEST_PROFILES[activeRole];

  // Active Code Inspection Tab
  const [activeCodeTab, setActiveCodeTab] = useState<
    'SQL' | 'MIDDLEWARE' | 'HELPERS' | 'ENV_LOCAL' | 'SEED_SCRIPT' | 'AUTH_FLOW'
  >('SQL');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Live Feedback Test Bed State
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<{ total: number; pending: number; resolved: number } | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Form states
  const [newFeedbackTitle, setNewFeedbackTitle] = useState('');
  const [newFeedbackMessage, setNewFeedbackMessage] = useState('');
  const [newFeedbackCategory, setNewFeedbackCategory] = useState<'feature_testing' | 'bug_report' | 'darshan_feedback'>('feature_testing');
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Route Simulation Test Bed State
  const [testRoute, setTestRoute] = useState<string>('/admin/users');
  const [simulatedRouteResult, setSimulatedRouteResult] = useState<{
    status: number;
    action: string;
    details: string;
  } | null>(null);

  // Content Upload Test State
  const [contentTitle, setContentTitle] = useState('');
  const [contentUploadStatus, setContentUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load feedback whenever active role changes
  const fetchFeedback = async () => {
    setIsLoadingFeedback(true);
    setFeedbackError(null);
    try {
      // In this test bed, if user is admin, request all feedback
      const query = activeRole === 'admin' ? '?role=admin' : `?role=${activeRole}&userId=${currentProfile.id}&viewAll=true`;
      const res = await fetch(`/api/rbac/feedback${query}`, {
        headers: {
          'x-user-role': activeRole,
          'x-user-id': currentProfile.id,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedbackError(data.error?.message || 'RLS Policy blocked access to view all feedback.');
        setFeedbackList([]);
        setFeedbackStats(null);
      } else {
        setFeedbackList(data.data || []);
        if (data.stats) setFeedbackStats(data.stats);
      }
    } catch {
      setFeedbackError('Network error connecting to RBAC API.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    setSubmissionSuccess(null);
    setContentUploadStatus(null);
  }, [activeRole]);

  const handleCopyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  // Submit Feedback Handler (Allowed for user, temple_admin, and admin)
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackTitle || !newFeedbackMessage) return;

    try {
      const res = await fetch('/api/rbac/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFeedbackTitle,
          message: newFeedbackMessage,
          category: newFeedbackCategory,
          rating: newFeedbackRating,
          userName: currentProfile.full_name,
          userEmail: currentProfile.email,
          userId: currentProfile.id,
          role: activeRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionSuccess('Feedback recorded successfully into Supabase public.feedback table!');
        setNewFeedbackTitle('');
        setNewFeedbackMessage('');
        fetchFeedback();
        setTimeout(() => setSubmissionSuccess(null), 4000);
      }
    } catch {
      alert('Error submitting feedback');
    }
  };

  // Resolve Feedback (Admin only)
  const handleResolveFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/rbac/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': activeRole,
        },
        body: JSON.stringify({
          status: 'resolved',
          adminNotes: `Verified and resolved by ${currentProfile.full_name} on ${new Date().toLocaleDateString()}`,
          role: activeRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchFeedback();
      } else {
        alert(data.error?.message || 'Permission denied');
      }
    } catch {
      alert('Error resolving feedback');
    }
  };

  // Test Upload Temple Content (temple_admin & admin only; user blocked)
  const handleTestUploadContent = async () => {
    if (!contentTitle.trim()) return;
    try {
      const res = await fetch('/api/rbac/temple-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': activeRole,
        },
        body: JSON.stringify({
          title: contentTitle,
          role: activeRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContentUploadStatus({
          success: true,
          message: `Success: Content published! Satisfied RLS policy "Allow temple_admin and admin to insert temple content".`,
        });
        setContentTitle('');
      } else {
        setContentUploadStatus({
          success: false,
          message: data.error?.message || 'Access Denied: Regular users cannot publish temple media.',
        });
      }
    } catch {
      setContentUploadStatus({
        success: false,
        message: 'Request failed.',
      });
    }
  };

  // Simulate Route Navigation via Next.js Middleware
  const handleSimulateRoute = (route: string) => {
    setTestRoute(route);
    const result = validateRouteAccess(route, activeRole);

    if (result.isAllowed) {
      setSimulatedRouteResult({
        status: 200,
        action: 'ALLOW (200 OK)',
        details: `Access Granted! Current role '${activeRole}' satisfies required roles [${result.matchedRule?.allowedRoles.join(', ')}] for '${route}'.`,
      });
    } else {
      setSimulatedRouteResult({
        status: 307,
        action: 'REDIRECT (307 Temporary Redirect)',
        details: `Access Blocked by Next.js middleware. Redirecting to '${result.redirectTo}?required_role=${result.matchedRule?.allowedRoles[0]}&redirected_from=${route}'. Current role '${activeRole}' lacks required permissions.`,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-slate-100">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Supabase + Next.js
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                RLS Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
              Role-Based Access Control (RBAC) System
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Production-grade PostgreSQL Row Level Security (RLS) policies and Next.js Edge Middleware for 
              <span className="text-slate-200 font-semibold"> Admin</span>, 
              <span className="text-slate-200 font-semibold"> Temple Admin / Content Creator</span>, and 
              <span className="text-slate-200 font-semibold"> User / Tester</span>.
            </p>
          </div>

          {/* Quick Role Indicator & Workflow Launchers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-800">
                <img src={currentProfile.avatar_url} alt={currentProfile.full_name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Simulated Persona</span>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  {currentProfile.full_name.split(' ')[0]}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-mono uppercase ${ROLE_DEFINITIONS[activeRole].badgeColor}`}>
                    {activeRole}
                  </span>
                </span>
              </div>
            </div>

            {/* Step 11 & 12 Interactive Modals trigger buttons */}
            <div className="flex items-center gap-2">
              {onOpenMobileAuth && (
                <button
                  onClick={onOpenMobileAuth}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Test Mobile OTP & Login Flow"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>OTP Login</span>
                </button>
              )}
              {onOpenTrustRegister && (
                <button
                  onClick={onOpenTrustRegister}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Test Temple Trust Onboarding"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Trust Onboard</span>
                </button>
              )}
              {onOpenSuperAdminQueue && (
                <button
                  onClick={onOpenSuperAdminQueue}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Super Admin Verification Queue"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Queue</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Role Switcher & Permissions Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            1. Role Selector &amp; Real-time Permissions Matrix
          </h2>
          <span className="text-[11px] text-slate-400">Click any role to simulate access across the platform</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['admin', 'temple_admin', 'user'] as UserRole[]).map((role) => {
            const def = ROLE_DEFINITIONS[role];
            const profile = MOCK_TEST_PROFILES[role];
            const isSelected = activeRole === role;

            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`p-5 rounded-2xl text-left transition-all border relative cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-950/40 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE SIMULATION
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">
                    {role === 'admin' ? '👑' : role === 'temple_admin' ? '🛕' : '📱'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{def.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{def.accessLevel}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {def.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">{profile.email}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${def.badgeColor}`}>
                    {role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Checkpoints for Currently Selected Role */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1 font-mono">
            {activeRole} Capabilities:
          </span>
          {[
            { action: 'manage_users' as PermissionAction, label: 'Manage Users' },
            { action: 'modify_database_structure' as PermissionAction, label: 'Modify DB Structure' },
            { action: 'access_cloud_infra' as PermissionAction, label: 'Access Vercel/Supabase' },
            { action: 'view_all_feedback' as PermissionAction, label: 'View All Feedback' },
            { action: 'upload_temple_content' as PermissionAction, label: 'Upload Temple Content' },
            { action: 'update_events' as PermissionAction, label: 'Update Events' },
            { action: 'upload_media' as PermissionAction, label: 'Upload Media' },
            { action: 'test_features' as PermissionAction, label: 'Test Features' },
            { action: 'submit_feedback' as PermissionAction, label: 'Submit Feedback' },
            { action: 'view_uploaded_content' as PermissionAction, label: 'View Uploaded Content' },
          ].map((item) => {
            const allowed = hasPermission(activeRole, item.action);
            return (
              <span
                key={item.action}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                  allowed
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-950/40 text-slate-500 border border-rose-900/30 line-through opacity-60'
                }`}
              >
                {allowed ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-rose-400" />}
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive RBAC Action Test Bed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Bed A: Feedback Submission & Admin Review Console */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-amber-400" />
                Feedback &amp; Testing RLS Verification
              </h3>
              <p className="text-[11px] text-slate-400">
                User / Tester can submit feedback. <span className="text-amber-400 font-semibold">Only Admin</span> can view all feedback.
              </p>
            </div>
            <button
              onClick={fetchFeedback}
              disabled={isLoadingFeedback}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
              title="Refresh Feedback Query"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeedback ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Submission Form (Allowed for all 3 roles: user, temple_admin, admin) */}
          <form onSubmit={handleSubmitFeedback} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                Submit Test Feedback ({activeRole})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">RLS: ALLOWED FOR ALL ROLES</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Category</label>
                <select
                  value={newFeedbackCategory}
                  onChange={(e) => setNewFeedbackCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="feature_testing">Feature Testing</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="darshan_feedback">Darshan Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Rating</label>
                <select
                  value={newFeedbackRating}
                  onChange={(e) => setNewFeedbackRating(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              required
              placeholder="Feedback Title (e.g. Aarti Audio Volume on Mobile)"
              value={newFeedbackTitle}
              onChange={(e) => setNewFeedbackTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

            <textarea
              required
              rows={2}
              placeholder="Describe your testing observation or devotee feedback..."
              value={newFeedbackMessage}
              onChange={(e) => setNewFeedbackMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono truncate">
                Submitting as: {currentProfile.full_name}
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Submit Feedback
              </button>
            </div>

            {submissionSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submissionSuccess}</span>
              </div>
            )}
          </form>

          {/* Feedback Display / Admin View Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                All Feedback Store (RLS Query View)
              </span>
              {feedbackStats && (
                <span className="text-[10px] text-amber-400 font-mono">
                  {feedbackStats.total} Total | {feedbackStats.pending} Pending | {feedbackStats.resolved} Resolved
                </span>
              )}
            </div>

            {/* If Non-Admin: Simulates RLS Rejection Alert */}
            {activeRole !== 'admin' ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-200">
                  <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>RLS Security Boundary: Access Restricted</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-300/90">
                  You are simulated as <span className="font-mono font-bold uppercase">{activeRole}</span>.
                  Under Supabase policy <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-amber-300">"Allow admin full access"</code> on table <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono">public.feedback</code>, only the <span className="font-bold">admin</span> role can inspect other devotees' feedback and resolution notes.
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveRole('admin')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Switch to Admin Persona to View All
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {feedbackList.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {item.title}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                          item.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.category}</span>
                    </div>

                    <p className="text-[11px] text-slate-300">{item.message}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>By {item.userName} ({item.role})</span>
                      {item.status !== 'resolved' ? (
                        <button
                          onClick={() => handleResolveFeedback(item.id)}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Resolved by Admin
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Test Bed B: Content Upload & Route Guard Middleware Simulation */}
        <div className="space-y-6">
          {/* Test Bed B1: Temple Content & Media Upload (temple_admin & admin only) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  Temple Content &amp; Media Upload RLS
                </h3>
                <p className="text-[11px] text-slate-400">
                  Requires <span className="text-amber-400 font-semibold">temple_admin</span> or <span className="text-amber-400 font-semibold">admin</span>. Regular users are blocked.
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                hasPermission(activeRole, 'upload_temple_content')
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {hasPermission(activeRole, 'upload_temple_content') ? 'ACCESS PERMITTED' : 'ACCESS DENIED'}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Content Title (e.g. Siddhivinayak Evening Aarti HD)"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleTestUploadContent}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  hasPermission(activeRole, 'upload_temple_content')
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 hover:bg-rose-900/60 text-slate-400'
                }`}
              >
                Upload Content
              </button>
            </div>

            {contentUploadStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                contentUploadStatus.success
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-800 text-rose-300'
              }`}>
                {contentUploadStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{contentUploadStatus.message}</span>
              </div>
            )}
          </div>

          {/* Test Bed B2: Next.js Middleware Route Enforcement Simulator */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  Next.js Edge Middleware Simulator
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tests URL matching in <code className="text-cyan-300 font-mono">middleware.ts</code> against active role
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-300">
                Select Route to Test:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { path: '/admin/users', label: '/admin/users (Admin Only)' },
                  { path: '/feedback/admin', label: '/feedback/admin (Admin Only)' },
                  { path: '/temple-manage/events', label: '/temple-manage (Temple Admin)' },
                  { path: '/content-creator/upload', label: '/content-creator (Creators)' },
                  { path: '/feedback/submit', label: '/feedback/submit (Auth Users)' },
                  { path: '/', label: '/ (Public Feed)' },
                ].map((r) => (
                  <button
                    key={r.path}
                    onClick={() => handleSimulateRoute(r.path)}
                    className={`p-2.5 rounded-xl text-left text-xs font-mono transition-all border cursor-pointer truncate ${
                      testRoute === r.path
                        ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {r.path}
                  </button>
                ))}
              </div>
            </div>

            {simulatedRouteResult && (
              <div className={`p-3.5 rounded-2xl text-xs space-y-1.5 border ${
                simulatedRouteResult.status === 200
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}>
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="flex items-center gap-1.5">
                    {simulatedRouteResult.status === 200 ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                    {simulatedRouteResult.action}
                  </span>
                  <span className="text-[10px] opacity-80">Route: {testRoute}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{simulatedRouteResult.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Complete Code & SQL Migration Inspector with 1-Click Copy */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Production Code &amp; SQL Migration Artifacts
              </h3>
              <p className="text-xs text-slate-400">
                Directly copyable for your Supabase SQL Editor and Next.js project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCodeTab('SQL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'SQL' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Supabase SQL
            </button>
            <button
              onClick={() => setActiveCodeTab('MIDDLEWARE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'MIDDLEWARE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Middleware
            </button>
            <button
              onClick={() => setActiveCodeTab('HELPERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'HELPERS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. RBAC Helpers
            </button>
            <button
              onClick={() => setActiveCodeTab('ENV_LOCAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'ENV_LOCAL' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4. .env.local
            </button>
            <button
              onClick={() => setActiveCodeTab('SEED_SCRIPT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'SEED_SCRIPT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5. Seed Script
            </button>
            <button
              onClick={() => setActiveCodeTab('AUTH_FLOW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCodeTab === 'AUTH_FLOW' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              6. Auth / OTP Flow
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
            <span>
              {activeCodeTab === 'SQL' && 'supabase/migrations/20260912000002_rbac_profiles_and_rls.sql'}
              {activeCodeTab === 'MIDDLEWARE' && 'src/middleware.ts (Next.js App/Pages Router)'}
              {activeCodeTab === 'HELPERS' && 'src/lib/supabase-rbac.ts (Server Actions & Route Handlers)'}
              {activeCodeTab === 'ENV_LOCAL' && '.env.local (Live Supabase & PostgreSQL Credentials)'}
              {activeCodeTab === 'SEED_SCRIPT' && 'scripts/seed-db.js (@supabase/supabase-js Seeder)'}
              {activeCodeTab === 'AUTH_FLOW' && 'src/lib/supabase-auth-flow.ts (Mobile OTP & Trust Upload)'}
            </span>
            <button
              onClick={() => {
                const codeToCopy =
                  activeCodeTab === 'SQL'
                    ? SUPABASE_SQL_CODE
                    : activeCodeTab === 'MIDDLEWARE'
                    ? MIDDLEWARE_CODE
                    : activeCodeTab === 'HELPERS'
                    ? HELPERS_CODE
                    : activeCodeTab === 'ENV_LOCAL'
                    ? STEP_11_ENV_CODE
                    : activeCodeTab === 'SEED_SCRIPT'
                    ? STEP_11_SEED_CODE
                    : STEP_12_AUTH_CODE;
                handleCopyCode(codeToCopy, activeCodeTab);
              }}
              className="px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedTab === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          <pre className="p-4 overflow-x-auto max-h-96 text-slate-300 leading-relaxed text-[11px]">
            <code>
              {activeCodeTab === 'SQL' && SUPABASE_SQL_CODE}
              {activeCodeTab === 'MIDDLEWARE' && MIDDLEWARE_CODE}
              {activeCodeTab === 'HELPERS' && HELPERS_CODE}
              {activeCodeTab === 'ENV_LOCAL' && STEP_11_ENV_CODE}
              {activeCodeTab === 'SEED_SCRIPT' && STEP_11_SEED_CODE}
              {activeCodeTab === 'AUTH_FLOW' && STEP_12_AUTH_CODE}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
