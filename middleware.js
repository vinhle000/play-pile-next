import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://playpile.xyz',
      'https://www.playpile.xyz',
      'https://stage.playpile.xyz',
      'https://dev.playpile.xyz'
      'http://localhost:3000',
    ];
const protectedRoutes = process.env.PROTECTED_ROUTES
  ? process.env.PROTECTED_ROUTES.split(',')
  : ['/api/board/columns', '/api/user-games', '/dashboard'];

export async function middleware(req) {
  const origin = req.headers.get('origin');

  // CORS Handling
  if (allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204 });
    }
  } else {
    console.log(`CORS violation: ${origin} tried to access the API`);
    return NextResponse.json(
      { message: 'Origin not allowed' },
      { status: 403 },
    );
  }

  // Authentication Handling
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );
  if (isProtectedRoute) {
    try {
      const authResponse = await auth(req);
      if (authResponse) {
        console.log(`Authentication failed for ${req.nextUrl.pathname}`);
        return authResponse;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
