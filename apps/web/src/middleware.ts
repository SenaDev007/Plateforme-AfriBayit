import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

const SUPPORTED_COUNTRIES = ['bj', 'ci', 'bf', 'tg', 'gh', 'sn', 'cm', 'ng'];

/**
 * Multi-tenancy & Auth middleware — detects country from subdomain
 * and protects administrative routes.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const hostname = request.headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0]?.toLowerCase() ?? '';

  const country = SUPPORTED_COUNTRIES.includes(subdomain) ? subdomain : 'bj';

  // Admin Route Protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-country', country);
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
