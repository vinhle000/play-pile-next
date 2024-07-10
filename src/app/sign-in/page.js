import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import SignInButton from '@/components/auth/SignInButton';
import { auth } from '@/auth';

export default async function Page() {
  // const form = useForm({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //   },
  // });

  // const formSchema = z.object({
  //   email: z.string().email('Must be a valid email'),
  //   password: z
  //     .string()
  //     .min(4, 'Password must be at least 4 characters')
  //     .max(50),
  // });

  // if (status === 'loading') {
  //   return <p>Loading...</p>;
  // }
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-xs p-6 bg-white/20 backdrop-blur-xl rounded-xl shadow-xl">
          <h2 className="text-gray-700 text-lg font-bold mb-6 text-center">
            Sign In
          </h2>

          <SignInButton />
        </div>
      </div>
    );
  }
}
