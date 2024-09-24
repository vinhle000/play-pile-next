'use client';

import { signIn } from 'next-auth/react';

export default function SignInOptions() {
  return (
    <div className="space-y-4">
      {/* Google Sign-In Button */}
      <div className="provider">
        <button
          onClick={() => signIn('google')}
          className="flex items-center justify-center px-8 py-3 bg-white border border-gray-300 rounded-md transition-all hover:bg-blue-50"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google"
            className="mr-2 h-6 w-6"
          />
          <span className="text-gray-800">Sign in with Google</span>
        </button>
      </div>

      {/* Discord Sign-In Button */}
      <div className="provider">
        <button
          onClick={() => signIn('discord')}
          className="flex items-center justify-center px-8 py-3 bg-white border border-gray-300 rounded-md transition-all hover:bg-blue-700 hover:text-white"
        >
          <img
            src="https://authjs.dev/img/providers/discord.svg"
            alt="Discord"
            className="mr-2 h-6 w-6"
          />
          <span>Sign in with Discord</span>
        </button>
      </div>

      {/* Twitch Sign-In Button */}
      <div className="provider">
        <button
          onClick={() => signIn('twitch')}
          className="flex items-center justify-center px-8 py-3  bg-white border border-gray-300  rounded-md transition-all hover:bg-purple-600 hover:text-white"
        >
          <img
            src="https://authjs.dev/img/providers/twitch.svg"
            alt="Twitch"
            className="mr-2 h-6 w-6"
          />
          <span>Sign in with Twitch</span>
        </button>
      </div>
    </div>
  );
}
