import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'lib/axios';

export async function middleware(req: NextRequest) {
  const isPublic = [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
    '/verify/:token',
  ].includes(req.nextUrl.pathname);
  const hasAuthToken = req.cookies.has('token');

  if (isPublic && hasAuthToken) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (!isPublic && !hasAuthToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublic && hasAuthToken && !req.cookies.has('user')) {
    const { data } = await axios.get('/private', {
      params: {
        authToken: req.cookies.get('token'),
      },
    });

    req.cookies.set('user', data.data);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
    '/verify/:token',
    '/home',
  ],
};
