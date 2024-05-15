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
      navigate("/board") // FIXME: rediredt to home page, but needs to update the navBar
    })
    .catch((error) => {
      // FIXME: show red error message to user that login failed
      console.error('Error logging in user', error)
    })
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-xs p-6 bg-white/20 backdrop-blur-xl rounded-xl shadow-xl">
        <h2 className="text-gray-700 text-lg font-bold mb-6 text-center">Login</h2>

        <Form {...form} className=" flex-row block ">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">


              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className=" mb-4">
                    <FormControl>
                      <Input
                        type="text"
                        className=" bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700
                        leading-tight out  border-none focus:ring-4 ring-inherit focus:bg-white/60 focus:opacity-75"
                        placeholder="Email" {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
               />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className=" mb-6">

                    <FormControl>
                      <Input type="password" className="bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700
                      mb-3 leading-tight focus:outline-none border-none focus:bg-white/60 focus:opacity-75" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage className="flex-col justify-center"/>
                  </FormItem>
                )}
              />

          <div className="flex items-center justify-evenly">
          <Button type="submit" className="w-3/4 bg-purple-600/50 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </Button>
            <a className="block  font-bold text-xs text-gray-700 hover:text-blue-800 text-center" href="#">
              Forgot Password?
              </a>
            </div>
          </form>
        </Form>


      </div>
  </div>
  )
}

export default LoginPage