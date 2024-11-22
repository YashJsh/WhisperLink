import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bycrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req : Request) {
    await dbConnect();
    try{
        const {username, email, password} = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, 
            isVerified : true
        })
        if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exist"
            })
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail){
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message : "User is verified already"
                })
            }else {
                const hashedPassword = await bycrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        }else{  //User is coming for the first time
            const hashedPassword = await bycrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })
            await newUser.save();
        }

        const emailVerification = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailVerification.success) {
            return Response.json({
                success: false,
                message: "Failed to send verification email"
            })
        }
        return Response.json({
            success: true,
            message: "Verification email sent successfully"
        })
    }catch(error){
        console.error("Error registering user:", error)
        return Response.json(
            {
                success : false,
                message : "Error registering user"
            }, 
            {
                status : 500
            }
        )
    }
}