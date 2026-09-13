// =============================================================================
// File: src/middleware.ts (or root middleware.ts for Next.js App Router / Pages)
// Description: Next.js Middleware for Role-Based Access Control (RBAC) with Supabase
// Roles:
//   - 'admin': Full access to /admin/*, /feedback/admin/*, /temple-manage/*, etc.
//   - 'temple_admin': Access to /temple-manage/*, /content-creator/*, etc.
//   - 'user': Access to standard features, testing, and feedback submission.
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export type UserRole = 'admin' | 'temple_admin' | 'user';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // 1. Initialize Supabase Server Client with Next.js Cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.anant.org';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key-placeholder';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Query the user's role from the public.profiles table
  let role: UserRole | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    role = (profile?.role as UserRole) || null;
  }

  const { pathname } = request.nextUrl;

  // ===========================================================================
  // RBAC Enforcement Rules
  // ===========================================================================

  // RULE 1: Admin Only Routes (/admin/* and /feedback/admin/*)
  // Full control: Manage users, modify DB structure, access Vercel/Supabase, view all feedback
  if ((pathname.startsWith('/admin') || pathname.startsWith('/feedback/admin')) && role !== 'admin') {
    // If not logged in, redirect to login or homepage; if unauthorized, redirect back to homepage ('/')
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

  // RULE 3: Tester & Devotee Authenticated Routes (/feedback/submit, /profile/edit)
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

// Config matcher: Match all protected route segments
export const config = {
  matcher: [
    '/admin/:path*',
    '/feedback/admin/:path*',
    '/temple-manage/:path*',
    '/content-creator/:path*',
    '/feedback/submit',
  ],
};
