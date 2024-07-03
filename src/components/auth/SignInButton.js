import React from 'react';
import { signIn } from 'next-auth/react';

function SignInButton() {
  // Add provider name as a prop passed down

  return (
    <button className="bg-gray" onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  );
}

export default SignInButton;
