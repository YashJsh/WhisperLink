import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, {
        status: 404
      });
    }
    if (!user.isAcceptingMessage){
        return Response.json({ success: false, message: "User is not accepting messages"}, {
            status: 401
        })
    }
    const newMessage =  {content, createdAt : new Date()}
    user.messages.push(newMessage as Message)
    await user.save();
    return Response.json({ success: true, message: "Message Sent Successfully" }, {
        status: 200
      });

  } catch (error) {
    return Response.json({ success: false, message: "Error Occured while sending message", error }, {
        status: 500
      });
}}
