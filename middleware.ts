import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard',
    '/products/:path*',
    '/orders/:path*',
    '/integrations/:path*',
    '/automations',
    '/profile',
  ],
};
