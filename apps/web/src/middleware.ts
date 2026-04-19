import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_COUNTRIES = ['bj', 'ci', 'bf', 'tg', 'gh', 'sn', 'cm', 'ng'];

/**
 * Multi-tenancy middleware — detects country from subdomain
 * and injects it as a header for downstream use.
 * e.g. bj.afribayit.com → country = "bj"
 */
export function middleware(request: NextRequest): NextResponse {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0]?.toLowerCase() ?? '';

  const country = SUPPORTED_COUNTRIES.includes(subdomain) ? subdomain : 'bj';

  const response = NextResponse.next();
  response.headers.set('x-country', country);
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
