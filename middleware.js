import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_PATHS = ['/', '/login', '/signup', '/admin/login'];
const PUBLIC_API_PREFIXES = ['/api/auth/login', '/api/admin/auth/login', '/api/public/'];

// Allowed even while a forced password reset is pending
const FORCE_RESET_ALLOWED_PATHS = ['/change-password'];
const FORCE_RESET_ALLOWED_API = ['/api/auth/change-password', '/api/auth/logout'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ---- Platform admin area: entirely separate auth, no school scoping ----
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminToken = request.cookies.get('shuleloop_admin_session')?.value;

    if (!adminToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(adminToken, secret);
      if (!payload.isPlatformAdmin) throw new Error('Not a platform admin token');

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', String(payload.adminId));
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ---- Normal school-scoped app (principal/teacher) ----
  const token = request.cookies.get('shuleloop_session')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Force password reset before anything else, except the reset flow itself
    if (payload.mustChangePassword) {
      const allowed =
        FORCE_RESET_ALLOWED_PATHS.includes(pathname) ||
        FORCE_RESET_ALLOWED_API.some((p) => pathname.startsWith(p));
      if (!allowed) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Password change required' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/change-password', request.url));
      }
    }

    if (pathname.startsWith('/principal') || pathname.startsWith('/api/principal')) {
      if (payload.role !== 'principal') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (pathname.startsWith('/teacher') || pathname.startsWith('/api/teacher')) {
      if (payload.role !== 'teacher' && payload.role !== 'principal') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userId));
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-school-id', String(payload.schoolId));

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};