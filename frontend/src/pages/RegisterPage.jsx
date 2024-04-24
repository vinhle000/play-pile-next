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
    <div className="flex justify-center align h-screen">
    <Form {...form} className=" flex-row block ">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <FormField

        control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex items-center" >
              <FormLabel className="mr-4">Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel className="block w-1/4"></FormLabel>
              <FormControl>
                <Input className="block w-3/4" placeholder="Confirm Password" {...field} />
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