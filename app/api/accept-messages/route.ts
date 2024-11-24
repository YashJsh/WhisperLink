import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }
  const userId: any = user._id;
  const { acceptMessage } = await req.json();

  try {
    const updatedUser = await UserModel.findOneAndUpdate(userId, {
        isAcceptingMessage: acceptMessage,
        }, {
            new: true
        }
    );
    if(!updatedUser){
        return Response.json(
            {
              success: false,
              message: "Failed to update user status to accept messages",
            },
            { status: 401 }
        );
    }
    return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
          updatedUser
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


export async function GET(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }
    const userId: any = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                  success: true,
                  message: "User not found",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
              success: true,
              isAcceptingMessages : foundUser.isAcceptingMessage
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json(
          {
            success: false,
            message: "Error in getting message acceptng status",
          },
          { status: 500 }
        );
    }
   
}