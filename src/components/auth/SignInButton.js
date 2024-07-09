import React from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

function SignInButton() {
  // Add provider name as a prop passed down

  return (
    <Button
      variant={'outline'}
      className="bg-gray"
      onClick={() => signIn('google')}
    >
      Sign in with Google
    </Button>
  );
}

export default SignInButton;
