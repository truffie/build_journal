import { type NextRequest, NextResponse } from 'next/server';

const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:3000';

export function middleware(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  const target = new URL(`${pathname}${search}`, API_ORIGIN);

  return NextResponse.rewrite(target, {
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};
