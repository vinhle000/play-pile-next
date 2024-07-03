import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import SignInButton from '../components/auth/SignInButton';

const HomePage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>You are not signed in</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default HomePage;
