"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SignUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form } from "@/components/ui/form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const Page = () => {
    const [username, setUsername] = useState("");
    const [UserNameMessage, SetUserNameMessage] = useState("")
    const [isCHeckingUsername, SetIsCHeckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm ({
        resolver: zodResolver(SignUpSchema),
        defaultValues : {
            username: "",
            email: "",
            password: "",
        }
    });


    useEffect(()=>{
        const checkUsername = async ()=>{
            if(username){
                SetIsCHeckingUsername(true);
                try{
                    const response = await axios.get(`/api/unique-username?username=${username}`)
                    SetUserNameMessage(response.data.message)
                }
                catch(err){
                    const axiosError = err as AxiosError<ApiResponse>;
                    SetUserNameMessage(
                        "Error Checking Username"
                    )
                }finally{
                    SetIsCHeckingUsername(false);
                }
            } 
        }
        checkUsername()
    }, [username])

    const onSubmit = async (data : z.infer<typeof SignUpSchema>) => {
        setIsSubmitting(true);
        try{  
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            toast({
                title : "Success", 
                description : response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        }catch(error){
            console.error("Error in Signup for user")
            toast({
                title : "Error",
                description : "Some error occured",
                variant : "destructive"
            })
        }   
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-full max-w-md p-8 shadow-lg rounded-lg space-y-8  ">
             <div className="flex flex-col justify-center text-center items-center gap-2 pb-2 ">
                    <h1 className="text-4xl font-semibold">Welcome to Wishper Link</h1>
                    <p className="text-gray-500">Sign Up to get the Unkown Message</p>
             </div>
             <div className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} 
                                        onChange={(e)=>{
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                    />
                                </FormControl>
                                {isCHeckingUsername && <Loader2 className="animate-spin mr-2 h-4 w-4 "/>}
                                <p className= {`text-sm ${UserNameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                                    {UserNameMessage}
                                </p>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                : ( "Signup")
                            }
                        </Button>
                        </form>
                    </Form>
             </div>
             <div className = "text-center mt-4">
                 <p>
                    Already have an account? <Link href = "/sign-in" className="text-blue-600 hover:text-blue-800">SignIn</Link>
                 </p>
             </div>
        </div>
    </div>
  )
}

export default Page