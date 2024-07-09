import React from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
// import userService from '@/services/userService';

import { TailSpin } from 'react-loader-spinner';
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
// import UserContext from '@/contexts/UserContext';

import { useSession, signIn, signOut } from 'next-auth/react';
import SignInButton from '../components/auth/SignInButton';

function SignIn() {


  // const form = useForm({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //   },
  // });

  const { data: session, status } = useSession();
  //REMOVE: This will be replaced with useSessionhook;
  // const { user, loading, login } = useContext(UserContext);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email('Must be a valid email'),
    password: z
      .string()
      .min(4, 'Password must be at least 4 characters')
      .max(50),
  });



  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>

        <SignInButton />
      </div>
    );
  }



  function onSubmit(values) {
    login(values.email, values.password)
      .then((response) => {
        router.push('/board'); // FIXME: redirect to home page, but needs to update the navBar
      })
      .catch((error) => {
        // FIXME: show red error message to user that login failed
        console.error('Error logging in user', error);
      });
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-xs p-6 bg-white/20 backdrop-blur-xl rounded-xl shadow-xl">
        <h2 className="text-gray-700 text-lg font-bold mb-6 text-center">Login</h2>

    </div>
</div>
)
}

export default SignIn;
