'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import SignInButton from '../components/auth/SignInButton';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/sign-in');
  } else {
    router.push('/board');
  }

  return (
    <div>
      <p>HOME PAGE</p>
    </div>
  );
}
