// Type declarations for Next.js and Supabase SSR when deployed in Next.js environment

declare module 'next/server' {
  export class NextRequest {
    url: string;
    nextUrl: {
      pathname: string;
      searchParams: URLSearchParams;
    };
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string): void;
    };
    headers: Headers;
  }

  export class NextResponse {
    headers: Headers;
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string, options?: any): void;
      delete(name: string): void;
    };
    static next(init?: { request?: NextRequest }): NextResponse;
    static redirect(url: URL | string, status?: number): NextResponse;
    static json(body: any, init?: ResponseInit): NextResponse;
  }
}

declare module '@supabase/ssr' {
  export interface CookieOptions {
    name: string;
    value: string;
    options?: any;
  }

  export interface CreateServerClientOptions {
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      setAll(cookiesToSet: CookieOptions[]): void;
    };
  }

  export function createServerClient(
    supabaseUrl: string,
    supabaseAnonKey: string,
    options: CreateServerClientOptions
  ): any;
}
