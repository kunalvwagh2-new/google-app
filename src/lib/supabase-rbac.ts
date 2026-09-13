// =============================================================================
// File: src/lib/supabase-rbac.ts
// Role-Based Access Control (RBAC) System for Supabase & Next.js
// =============================================================================

export type UserRole = 'admin' | 'temple_admin' | 'user';

export type PermissionAction =
  | 'manage_users'
  | 'modify_database_structure'
  | 'access_cloud_infra' // Vercel / Supabase
  | 'view_all_feedback'
  | 'manage_feedback_status'
  | 'upload_temple_content'
  | 'update_events'
  | 'upload_media'
  | 'test_features'
  | 'submit_feedback'
  | 'view_uploaded_content';

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  role: UserRole;
  temple_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Strict Permission Matrix based on requirements:
 * 1. admin: Full control (manage users, access Vercel/Supabase, modify DB, view all feedback)
 * 2. temple_admin / content_creator: Upload temple content, update events, upload media, test features
 * 3. user / tester: Test features, submit feedback, view uploaded content
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionAction[]> = {
  admin: [
    'manage_users',
    'modify_database_structure',
    'access_cloud_infra',
    'view_all_feedback',
    'manage_feedback_status',
    'upload_temple_content',
    'update_events',
    'upload_media',
    'test_features',
    'submit_feedback',
    'view_uploaded_content',
  ],
  temple_admin: [
    'upload_temple_content',
    'update_events',
    'upload_media',
    'test_features',
    'submit_feedback',
    'view_uploaded_content',
  ],
  user: [
    'test_features',
    'submit_feedback',
    'view_uploaded_content',
  ],
} as const;

/**
 * Role Definitions with human-readable descriptions and badge styling
 */
export const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    title: string;
    description: string;
    badgeColor: string;
    accessLevel: string;
  }
> = {
  admin: {
    title: 'Admin (You / Platform Owner)',
    description: 'Full control: Manage users, access Vercel/Supabase, modify database structure, and view all feedback.',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accessLevel: 'Superuser / Full Platform Access',
  },
  temple_admin: {
    title: 'Temple Admin / Content Creator',
    description: 'Can upload temple content, update events, upload media, and test features.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accessLevel: 'Tenant Admin & Creator Access',
  },
  user: {
    title: 'User / Tester',
    description: 'Regular user access: Test features, submit feedback, and view uploaded content.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accessLevel: 'Devotee / Tester Access',
  },
};

/**
 * Check if a role has permission for a specific action
 */
export function hasPermission(role: UserRole | null | undefined, action: PermissionAction): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}

/**
 * Route protection rules configuration
 */
export const PROTECTED_ROUTES = [
  {
    prefix: '/admin',
    allowedRoles: ['admin'] as UserRole[],
    description: 'Platform Admin Dashboard, user management, and Supabase config',
    redirectTo: '/',
  },
  {
    prefix: '/feedback/admin',
    allowedRoles: ['admin'] as UserRole[],
    description: 'Admin Review Console for all devotee feedback',
    redirectTo: '/',
  },
  {
    prefix: '/temple-manage',
    allowedRoles: ['admin', 'temple_admin'] as UserRole[],
    description: 'Temple Trust CMS, event scheduling, and media uploads',
    redirectTo: '/',
  },
  {
    prefix: '/content-creator',
    allowedRoles: ['admin', 'temple_admin'] as UserRole[],
    description: 'Media upload studio & Aarti reels publisher',
    redirectTo: '/',
  },
  {
    prefix: '/feedback/submit',
    allowedRoles: ['admin', 'temple_admin', 'user'] as UserRole[],
    description: 'Tester & Devotee feedback submission form',
    redirectTo: '/login',
  },
];

/**
 * Validates route access for a given pathname and user role
 */
export function validateRouteAccess(
  pathname: string,
  userRole: UserRole | null | undefined
): { isAllowed: boolean; redirectTo?: string; matchedRule?: (typeof PROTECTED_ROUTES)[0] } {
  const matchedRule = PROTECTED_ROUTES.find((route) => pathname.startsWith(route.prefix));

  if (!matchedRule) {
    return { isAllowed: true };
  }

  if (!userRole) {
    return { isAllowed: false, redirectTo: '/login', matchedRule };
  }

  if (matchedRule.allowedRoles.includes(userRole)) {
    return { isAllowed: true, matchedRule };
  }

  return { isAllowed: false, redirectTo: matchedRule.redirectTo, matchedRule };
}

/**
 * Helper for Next.js Server Actions or Route Handlers (Edge / Node)
 * Throws an error or returns a standard response if unauthorized.
 */
export async function requireUserWithRole(
  supabaseClient: any,
  allowedRoles: UserRole[]
): Promise<{ user: any; profile: UserProfile }> {
  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

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
      `FORBIDDEN: Insufficient permissions. Requires one of [${allowedRoles.join(', ')}], current role is '${role}'.`
    );
  }

  return { user, profile: { ...profile, role } };
}

/**
 * Mock Profile Generator for Testing & Simulation
 */
export const MOCK_TEST_PROFILES: Record<UserRole, UserProfile> = {
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Kunal Wagh (Platform Admin)',
    email: 'kunalvwagh2@gmail.com',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    temple_id: 'all_temples',
  },
  temple_admin: {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Pandit Ramesh Shastri (Siddhivinayak Trust)',
    email: 'shastri@siddhivinayak.org',
    role: 'temple_admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    temple_id: 'siddhivinayak_mumbai',
  },
  user: {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Aditya Sharma (Beta Tester & Devotee)',
    email: 'aditya.tester@anant.org',
    role: 'user',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
};
