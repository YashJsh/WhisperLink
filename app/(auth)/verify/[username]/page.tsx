"use client"

import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const page = () => {
  const router = useRouter();
  const params = useParams();
  const username = params.username; 

  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
    });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      console.log("Username is :" +  username);
      console.log(data.code);
      const response = await axios.post(`/api/verify-code`, {
        username: username,
        code: data.code,
      });
      
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in signup of User", error);
      toast({
        title: "Signup failed",
        description: "Request failed",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg space-y-8  ">
        <div className="flex flex-col justify-center text-center items-center gap-2 pb-2 ">
          <h1 className="text-4xl font-semibold">Verify your account</h1>
          <p className="text-gray-500">
            Enter the verification code sent to your email
          </p>
        </div>
      
      <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the Otp here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className = "w-full " type="submit">Verify</Button>
        </form>
      </Form>
      </div>
    </div>
    </div>
  );
};

export default page;
