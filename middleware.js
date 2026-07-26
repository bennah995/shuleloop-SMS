import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes — no auth needed
  if (pathname === '/login' || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('shuleloop_session')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Role-based route protection
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

    // Attach user info to request headers so API routes can read it
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