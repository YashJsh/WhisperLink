"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import messages from "@/messages.json"
export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <div className="flex justify-center items-center p-6">
        <div className="flex w-1/6 bg-gray-100 justify-center rounded-xl h-10 items-center shadow-xl cursor-default text-gray-900 px-4">
          <h2 className="text-lg md:text-2xl font-semibold">Whisper Link</h2>
        </div>
        <div className="absolute right-20">
          <button
            className="rounded-xl hover:bg-gray-700 bg-gray-500 text-white px-4 py-2 font-semibold text-sm"
            onClick={() => {
              window.location.href = "/sign-in";
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Tagline Section */}
      <div className="flex flex-col justify-start items-center flex-grow text-center text-gray-900 mt-8">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter">
          Connect Anonymously,
        </h2>
        <h2 className="text-3xl md:text-6xl font-bold text-gray-500">
          Speak Freely
        </h2>
      </div>

      <div className="flex flex-col justify-start items-center flex-grow text-center text-gray-900 mt-8">
        <Carousel className="w-full max-w-xs ">
          <CarouselContent className="-ml-2 md:-ml-4">
            {messages.map((message, index)=>(
              <CarouselItem key={index} className="pl-2 md:pl-4">
                <Card className="bg-gray-100 shadow-lg">
                  <CardHeader className="flex text-lg">{message.title}</CardHeader>
                <CardContent className="flex aspect-square items-start justify-center p-6 basis-1/3">
                  <span className="text-2xl font-semibold">{message.content}</span>
                </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
