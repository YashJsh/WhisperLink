import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose, { Mongoose } from "mongoose";

export async function GET(req : Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }
    const userId: any = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind : '$messages'},
            { $sort : {'messages.createdAt' : -1}},
            { $group : {_id : '$id', messages :{$push : '$messages'}}} 
        ])
        console.log(user);
        if (!user || user.length === 0) {
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                { status: 401 }
              );
        }
        console.log(user[0].messages);
        return Response.json(
            {
              success: true,
              messages : user[0].messages
            },
            { status: 200 }
          );
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json(
          {
            success: false,
            message: "Failed to update user status to accept messages",
          },
          { status: 500 }
        );
    }
    
}