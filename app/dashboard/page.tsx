"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import { Bird, Loader2, RefreshCcw } from "lucide-react";
import e from "cors";
const Page = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageID: string) => {
    setMessages(messages.filter((message) => message._id !== messageID));
  };
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Showing latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      if (!acceptMessages) {
        toast({
          title: "Switch On",
          description: "Messages acceptance 'ON'",
          variant: "default",
          duration: 2000,
        });
      } else {
        toast({
          title: "Switch OFF",
          description: "Messages acceptance 'OFF'",
          variant: "default",
          duration: 2000,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );

  //do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    console.log("acceptMessages:", acceptMessages);
    toast({
      title: "Copied to clipboard",
      description: "Profile URL copied to clipboard",
      duration: 1000,
    });
  };

  const homeClick = () => {
    toast({
      title: "Where you wanna go now?",
      description: "Stay here, you are already in HOME",
    });
  };
  return (
    <div className="w-full h-screen">
      <div className="pt-4 flex justify-center items-center relative">
        <div className="fixed flex w-1/6 bg-gray-100 justify-around rounded-xl h-10 items-center shadow-xl cursor-pointer text-gray-900 text-sm mt-8">
          <Button className="underline" onClick={homeClick}>
            <h1>Home</h1>
          </Button>
          <Button
            onClick={() => {
              window.location.href = "https://github.com/YashJsh";
            }}
          >
            About
          </Button>
          <Button
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
      <div className="mt-[8vh] flex text-6xl font-bold justify-center text-center tracking-tighter">
        <h1>
          {session ? (
            <>
              <div>
                <h1>Welcome back</h1>
              </div>
              <span className="text-gray-600">
                {user.username || user.email}
              </span>
            </>
          ) : (
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          )}
        </h1>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className=" w-1/5 mt-8 flex justify-center items-center gap-2 rounded-xl py-3  text-center ">
          <label htmlFor="profileUrl" className="sr-only">
            Profile URL
          </label>
          <input
            id="profileUrl"
            className="w-full text-lg ml-1 rounded-lg shadow-lg px-4 py-1   "
            type="text"
            value={profileUrl}
            disabled
          />
          <div className="">
            <button
              onClick={copyToClipboard}
              className="bg-black text-white px-4 py-1 rounded-xl shadow-lg  pointer"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow flex flex-col items-center justify-center mt-8 mb-4">
        <Button
          className="mt-4"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className=" w-1/5 mt-8 flex justify-center items-center gap-2 rounded-xl py-3  text-center ">
          <h1 className="text-2xl">Messages</h1>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        {messages.length > 0 ? (
           <div className="sm:mx-7 md:mx-3 lg:mx-12 rounded max-w-8xl grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
          {messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))}
          </div>
        ) : (
        
            <div className="flex flex-col mt-[10vh] h-[22vh] items-center justify-start w-full  ">
              <Bird className="h-16 w-16 animate-bounce" />
              <h1 className="text-2xl">You got no messages</h1>
            </div>
          
        )}

      </div>

      <footer className="fixed bottom-0 w-full flex justify-center items-center gap-2 text-center py-4">
        <div className="flex items-center space-x-2 font-semibold">
          <span>Accept Messages: </span>
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          {/* <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span> */}
        </div>
      </footer>
    </div>
  );
};

export default Page;
