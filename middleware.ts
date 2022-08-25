import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isPublic = [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
  ].includes(req.nextUrl.pathname);

  if (isPublic && req.cookies.has('user')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
    '/home',
  ],
};
