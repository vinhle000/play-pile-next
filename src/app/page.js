'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/sign-in');
    } else {
      router.push('/board');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>HOME PAGE</p>
    </div>
  );
}
