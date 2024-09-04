'use client';

import { SessionProvider } from 'next-auth/react';

// Client-side SessionProvider component
export default function ClientSessionProvider({ session, children }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}