"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SignInSchema } from "@/schemas/signInSchema"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm ({
      resolver: zodResolver(SignInSchema),
      defaultValues : {
          email: "",
          password: "",
      }
  });


  const onSubmit = async (data : z.infer<typeof SignInSchema>) => {
      setIsSubmitting(true);
      try{
        const response = await signIn('credentials',{
          redirect : false,
          email: data.email,
          password: data.password
        })
        if(response?.error){
          toast({
            title : "Login failed", 
            description : "Incorrect username or password",
            variant : "destructive",
            duration : 1000
        })
        form.reset();
        } else{
          toast({
              title : "Logged In", 
              description : "Welcome to Whisper Link",
              duration : 1000
          })
          if (response?.url){
            router.replace('/dashboard')
          }
        }
      }catch(error){
          console.error("Error in Signin for user", error)
          toast({
              title : "Error",
              description : "Some error occured",
              variant : "destructive"
          })
      }  finally{
            setIsSubmitting(false);
      }
  }
return (
  <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg space-y-8  ">
           <div className="flex flex-col justify-center text-center items-center gap-2 pb-2 ">
                  <h1 className="text-4xl font-semibold">Welcome to Wishper Link</h1>
                  <p className="text-gray-500">Sign In to get the Unkown Message</p>
           </div>
           <div className="">
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                          <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                  <Input type = "email" placeholder="johndoe@gmail.com" {...field} 
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
                              <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                  <Input type = "password" 
                                  placeholder="password" {...field} 
                                  />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <Button className = "mt-5 w-full " type = "submit" disabled = {isSubmitting}>
                          {
                              isSubmitting ? ( 
                                  <>
                                      <Loader2 /> Please wait
                                  </>
                              )
                              : ( "Sign In")
                          }
                      </Button>
                      </form>
                  </Form>
           </div>
           <div className = "text-center mt-4">
               <p>
                  New User !! <Link href = "/sign-up" className="text-blue-600 hover:text-blue-800 underline">SignUp</Link>
               </p>
           </div>
      </div>
  </div>
)
}


export default Page