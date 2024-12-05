import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(req : Request, { params } : {params : {messageid : string}}){
    const messageid = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }
    try {
      const updateResultt = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: {_id : messageid}}});
      if(updateResultt.modifiedCount == 0){
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
      console.log("Error in delete message route", error)
      return Response.json({ success: false, message: "Error deleting message"}, {status: 404});
    }
       
}