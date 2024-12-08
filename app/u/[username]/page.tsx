"use client";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Page = () => {
  const params = useParams();
  const name = params.username;
  const { toast } = useToast();
  const [message, setMessage] = useState("")


  const sendMessage = async () => {
    try {
      const response = await axios.post("/api/send-message", {
        username: name,
        content: message,
      });
      if (!response.data.success) {
        toast({
          title: "Unable to send the message",
          description: "User is not accepting message",
          variant: "destructive",
          duration: 2000,
        });
      } else {
        toast({
          title: "Success",
          description: "Message Send Successfully",
          duration: 2000,
        });
      }
      setMessage("")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  };
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
     <div className="flex justify-center items-center px-4 md:px-8 py-4">
        <div className="flex justify-between items-center text-center w-fit bg-gray-100 rounded-xl h-auto shadow-xl cursor-default text-gray-900 px-4 py-3">
          <Link href={'/sign-in'}>
          <h2 className="text-lg md:text-2xl lg:text-2xl font-semibold tracking-tighter ">
            Whisper Link
          </h2></Link>
          
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-6 gap-4">
  <h1 className="text-base md:text-lg lg:text-xl font-semibold text-center">
    Send Message to <span className="text-gray-500">{name}</span> Anonymously
  </h1>
  <div className="w-full md:w-2/3 lg:w-2/3 px-4 min-h-[10rem]">
    <Textarea
      placeholder="Type your message here."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <Button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6  rounded-lg transition-all duration-200"
    onClick={sendMessage}
  >
    Send
  </Button>
</div>
    </div>
  );
};

export default Page;
