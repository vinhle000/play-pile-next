import { useContext } from "react"
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


function RegisterPage() {

  const { user, loading, register } = useContext(UserContext);
  const navigate = useNavigate();

  const formSchema = z.object({
    username: z.string()
      .min(2, "Username must be at least 2 characters.")
      .max(50, "Username max is 50 characters."),
    email: z.string().email("Must be a valid email"),
    password: z.string().min(4, "Password must be at least 4 characters").max(50),
    confirmPassword: z.string().min(4, "Confirm Password must be at least 4 characters").max(50),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values) {
    register(values.username, values.email, values.password, values.confirmPassword)
    .then((response) => {
      console.log('User registered', response)
      navigate("/board")
    })
    .catch((error) => {
      console.error('Error registering user', error)
    })
  }

  return (
    <div className="flex justify-center mt-10">

    <div className="w-full max-w-xs p-6 bg-white/20 backdrop-blur-xl rounded-xl shadow-xl">
     <h2 className="text-gray-700 text-lg font-bold mb-6 text-center">Register</h2>
      <Form {...form} className=" flex-row block ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <FormField

          control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start" >
                {/* <FormLabel className="text-xs px-1 -mb-1.5">Username</FormLabel> */}
                <FormControl>
                  <Input className="bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700
                    leading-tight focus:outline-none border-none focus:bg-white/60 focus:opacity-75" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                  {/* <FormLabel className="text-xs px-1 -mb-1.5">Email</FormLabel> */}
                <FormControl>
                <Input
                  type="text"
                  className=" bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700
                  leading-tight focus:outline-none border-none focus:ring-0 focus:bg-white/60 focus:opacity-75"
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
              <FormItem className="flex flex-col items-start">
              {/* <FormLabel className="text-xs px-1 -mb-1.5">Password</FormLabel> */}
                <FormControl>
                <Input
                  type="password"
                  className=" bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700 text-sm
                  leading-tight focus:outline-none border-none focus:ring-0 focus:bg-white/60 focus:opacity-75"
                  placeholder="Password" {...field}
                />
                </FormControl>
                <FormMessage className="flex-col justify-center"/>
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormControl>
                <Input
                  type="password"
                  className=" bg-white bg-opacity-30 rounded w-full py-2 px-3 text-gray-700
                  leading-tight focus:outline-none border-none focus:ring-0 focus:bg-white/60 focus:opacity-75"
                  placeholder="Confirm Password" {...field}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
             <Button type="submit" className="w-full bg-purple-600/50 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default RegisterPage