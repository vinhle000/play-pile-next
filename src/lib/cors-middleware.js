import { NextResponse } from 'next/server';

export function middleware(req) {
  const origin = req.headers.get('origin');
  const allowedOrigins = ['https://playpile.xyz', 'https://www.playpile.xyz'];

  if (allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type',
      'Authorization',
    );
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204 });
    }

    return response;
  }

  return NextResponse.json({ message: 'Not allowed' }, { status: 204 });
}

export const config = {
  matcher: '/api/:path*', // Apply middleware only to API routes
};
