export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    '/api/board/columns/:path*',
    '/api/user-games/:path*',
    '/dashboard/:path*',
  ],
};
