"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react"
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId : string) => void
}
const MessageCard = ({message, onMessageDelete} : MessageCardProps) => {
    const { toast } = useToast();
    const handleDeleteConfirm = async () =>{
      try{
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message,
            description: "The message has been deleted",
        })
        onMessageDelete(message._id);
      }catch(error){
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to delete message',
          variant: 'destructive',
        });
      }
    }
  return (
    <Card className="flex flex-col h-[40vh] bg-gray-100 shadow-xl overflow-hidden relative">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg truncate w-4/5">Anonymous</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="absolute bottom-0 right-0 mb-3">
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardHeader>
    <CardContent className="flex-grow overflow-y-auto px-4 py-2">
      {message.content}
    </CardContent>
  </Card>
);
}
export default MessageCard;