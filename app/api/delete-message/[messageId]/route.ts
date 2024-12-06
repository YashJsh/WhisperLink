import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }
    try {
        // Convert messageId to ObjectId
        const messageObjectId = new ObjectId(messageId);

        const updateResult = await UserModel.updateOne(
            { _id: new ObjectId(_user._id) },
            { $pull: { messages: { _id: messageObjectId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "Message Deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete message route", error);
        return Response.json(
            { success: false, message: "Error deleting message" },
            { status: 500 }
        );
    }
}
