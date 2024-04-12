import React, {useContext,} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import userService from "@/services/userService"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import UserContext from "@/contexts/UserContext";


 function LoginPage() {

  const { user, loading, login } = useContext(UserContext);
  const navigate = useNavigate();

  const formSchema = z.object({

    email: z.string().email("Must be a valid email"),
    password: z.string().min(4, "Password must be at least 4 characters").max(50),

  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {

    login(values.email, values.password)
    .then((response) => {
      console.log('User logged in', response)
      navigate("/") // FIXME: rediredt to home page, but needs to update the navBar
    })
    .catch((error) => {
      // FIXME: show red error message to user that login failed
      console.error('Error logging in user', error)
    })
  }
  return (
    <div className="flex justify-center align h-screen">
    <Form {...form} className=" flex-row block ">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">


          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel className="block w-1/4">Email</FormLabel>
              <FormControl>
                <Input className="block w-3/4" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel className="block w-1/4">Password</FormLabel>
              <FormControl>
                <Input className="block w-3/4" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage className="flex-col justify-center"/>
            </FormItem>
          )}
        />

        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  </div>
  )
}

export default LoginPage