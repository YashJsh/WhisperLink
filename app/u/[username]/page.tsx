"use client";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";


const page = () => {
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
      <div className="flex justify-center items-center p-6">
        <div className="flex w-1/6 bg-gray-100 justify-center rounded-xl h-10 items-center shadow-xl cursor-default text-gray-900 px-4">
          <h2 className="text-lg md:text-2xl font-semibold">Whisper Link</h2>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center p-6 gap-4'>
        <h1 className="text-lg md:text-xl font-semibold">
          Send Message to {name} Anonymously
        </h1>
        <div className="w-1/5">
            <Textarea placeholder="Type your message here." value = {message} onChange={(e) => setMessage(e.target.value)} /> 
        </div>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold" onClick={sendMessage}>Send
        </Button>

      </div>
    </div>
  );
};

export default page;
