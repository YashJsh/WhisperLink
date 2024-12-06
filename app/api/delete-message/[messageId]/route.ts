import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { messageId: string } }) {
    const { messageId } = params;

    await dbConnect();

    // Get the session
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    // Check if the session is valid
    if (!session || !_user) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    try {
        // Convert messageId to ObjectId for MongoDB query
        const messageObjectId = new ObjectId(messageId);

        // Remove the message from the user's messages array
        const updateResult = await UserModel.updateOne(
            { _id: new ObjectId(_user._id) },
            { $pull: { messages: { _id: messageObjectId } } }
        );

        // Check if the message was actually deleted
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        // Return a success response if the message was deleted
        return NextResponse.json(
            { success: true, message: "Message Deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete message route", error);
        return NextResponse.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}