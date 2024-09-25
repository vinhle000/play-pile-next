import React from 'react';

import SignInOptions from '@/components/auth/SignInOptions';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-xs p-6 bg-white/20 backdrop-blur-xl rounded-xl shadow-xl">
          {/* <h2 className="text-gray-700 text-lg font-bold mb-6 text-center">
            Sign In
          </h2> */}

          <SignInOptions />
        </div>
      </div>
    );
  }
}
