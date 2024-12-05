"use client"

import React, { useCallback, useEffect, useState } from 'react'
import Link from "next/link"
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth';
import { Button } from '@react-email/components';
import { Message } from '@/model/User';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { trackDynamic } from 'next/dist/server/route-modules/app-route/module';
import axios, {AxiosError} from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
const page = () => {
  const { data: session } = useSession()
  const user : User = session?.user as User;
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const {toast } = useToast();

  const handleDeleteMessage = (messageID : string) =>{
    setMessages(messages.filter((message)=> message._id !== messageID))
  }
  const form = useForm({
    resolver : zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async() => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant : "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async(refresh : boolean = false)=>{
      setIsLoading(false);
      setIsSwitchLoading(false);
      try{
        const response = await axios.get('/api/get-messages') 
        setMessages(response.data.messages || [])
        if (refresh){
          toast({
            title: 'Messages refreshed',
            description: "Showing latest Messages"
          })
        }
      }catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant : "destructive"
      })
      }finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
  }, [setIsLoading, setMessages])

  useEffect(()=>{
      if( !session || !session.user )return
      fetchMessages();
      fetchAcceptMessage()    
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async() =>{
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages : !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title : response.data.message,
        variant : 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant : "destructive"
      })
    }
  }

  const {username} = session?.user as User;
  //do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title : 'Copied to clipboard',
      description : "Profile URL copied to clipboard",
    })
  }

  if(!session || !session.user) return <div>Not logged in</div>


  return (
    <div className="w-full h-screen ">
      <div className="pt-4 flex justify-center items-center ">
        <div className="flex w-1/6 bg-gray-100 justify-around rounded-xl h-10 items-center shadow-xl cursor-pointer text-gray-900 text-sm ">
          <Button className="underline"><h1>
            Home</h1></Button>
          <Button>About</Button>
          <Button onClick={()=>{
            signOut()
          }}>Sign Out</Button>
        </div>
      </div>
      <div className="mt-[8vh] flex text-6xl font-bold justify-center text-center tracking-tighter">
          <h1>{
              session ? (
                <>
                  <div>
                    <h1>Welcome back </h1>
                  </div>
                  <span className="text-gray-600">{user.username  || user.email}</span>
                  
                </>
              ) : (
                <>
                  <Link href = "/sign-in">
                  <Button>Sign in
                  </Button></Link>
                </>
              )
            } 
          </h1>
      </div>
      <div>
        
      </div>
    </div>
  )
} 

export default page