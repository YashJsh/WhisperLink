import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request : Request){
    await dbConnect();
    try{
        const { username, code} = await request.json();
        const user = await UserModel.findOne({username})
        if (!user){
            return Response.json({
                success: false,
                message: "User not found"
            },
            {status: 404})
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCode) > new Date();
        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: 'Account verified Successfully'
            }, {
            status : 200
            })
        }
        else if (!isCodeNotExpired){
            return Response.json({
                success: false,
                message :  "Verification code expired, please login again to get the new code"
            }, 
            { status : 400})
        }
        else {
            return Response.json({
                success: false,
                message :  "Code is incorrect"
            }, 
            { status : 400})
        }
    }catch(error){
        console.error("Error verify code", error)
        return Response.json({ 
            success : false,
            message : "Error verifying user"
        },
        {
            status : 500
        }
    )  
    }
}