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
  }, [setValue, toast]);

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
        // toast({
        //   title: "Error is this",
        //   description: axiosError.response?.data.message,
        //   variant: "destructive",
        // });
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
      await axios.post<ApiResponse>("/api/accept-messages", {
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
    <div className="w-full h-screen ">
      <div className="pt-4 flex justify-center items-center relative">
        <div className="fixed flex justify-around items-center bg-gray-100 rounded-xl h-12 px-4 md:px-8 shadow-xl cursor-pointer text-gray-900 text-xs font-medium md:text-sm lg:text-base mt-8 space-x-4 min-w-auto lg:w-1/3">
          <Button className="hover:text-gray-700" onClick={homeClick}>
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
            className="hover:text-gray-700 text-red-500"
            onClick={() => {
              signOut();
            }}
          >
            SignOut
          </Button>
        </div>
      </div>
      <div className="mt-[8vh] flex flex-col text-center font-bold tracking-tighter">
        <h1 className="text-3xl md:text-5xl lg:text-6xl">
          {session ? (
            <>
              <div>
                <h1 className="font-bold">Welcome back</h1>
              </div>
              <span className="block text-gray-400 text-xl md:text-3xl lg:text-4xl mt-2">
                {user.username || user.email}
              </span>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="text-lg md:text-2xl lg:text-3xl px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-all duration-200">
                Sign in
              </Button>
            </Link>
          )}
        </h1>
      </div>
      <div className="w-full flex flex-col items-center">
  {/* Profile URL Section */}
  <div className="w-full sm:w-1/5 md:w-1/3 lg:w-1/3 mt-8 flex justify-center items-center gap-2 rounded-xl py-3 text-center px-4">
    <label htmlFor="profileUrl" className="sr-only">
      Profile URL
    </label>
    <input
      id="profileUrl"
      className="flex-grow text-base md:text-lg rounded-lg shadow-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      value={profileUrl}
      disabled
    />
    <button
      onClick={copyToClipboard}
      className="bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200"
    >
      Copy
    </button>
  </div>

  {/* Fetch Messages Section */}
  <div className="w-full flex-grow flex flex-col items-center justify-center mt-8 mb-4">
    <Button
      className="mt-1 flex justify-center items-center  px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
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
</div>
<div className="w-full flex justify-center items-center ">
  <div className="w-full md:w-2/3 lg:w-1/3 flex justify-center items-center gap-2 rounded-xl py-3 px-4 text-center">
    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
      Messages
    </h1>
  </div>
</div>

<div className="w-full flex justify-center items-center ">
  {messages.length > 0 ? (
    <div className="mx-4 md:mx-6 lg:mx-12 rounded-lg max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-6 mb-12 w-full">
      {messages.map((message) => (
        <MessageCard
          key={message._id}
          message={message}
          onMessageDelete={handleDeleteMessage}
        />
      ))}
    </div>
  ) : (
    <div className="flex flex-col mt-16 md:mt-[10vh] h-auto items-center justify-start w-full text-center">
      <Bird className="h-12 w-12 md:h-16 md:w-16 animate-bounce text-gray-600" />
      <h1 className="text-lg md:text-2xl text-gray-800 font-semibold mt-4">
        You got no messages
      </h1>
    </div>
  )}
</div>

      <footer className="fixed bottom-0 w-full flex justify-center items-center gap-2 text-center py-4  bg-transparent">
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
