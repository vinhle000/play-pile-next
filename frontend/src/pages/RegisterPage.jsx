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
      navigate("/")
    })
    .catch((error) => {
      console.error('Error registering user', error)
    })
  }

  return (
    <div className="flex justify-center align h-screen mt-14">
    <Form {...form} className=" flex-row block ">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <FormField

        control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start" >
              <FormLabel className="text-xs px-1 -mb-1.5">Username</FormLabel>
              <FormControl>
                <Input className="block w-full bg-gray-300
             placeholder:text-black/50
             focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" placeholder="username" {...field} />
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
                <FormLabel className="text-xs px-1 -mb-1.5">Email</FormLabel>
              <FormControl>
                <Input className="block w-full bg-gray-300
             placeholder:text-black/50
             focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Email" {...field} />
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
            <FormLabel className="text-xs px-1 -mb-1.5">Password</FormLabel>
              <FormControl>
                <Input className="block w-full bg-gray-300
             placeholder:text-black/50
             focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage className="flex-col justify-center"/>
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Input className="block w-full bg-gray-300
             placeholder:text-black/50
             focus:bg-gray-100/40 focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Register</Button>
      </form>
    </Form>
  </div>
  )
}

export default RegisterPage