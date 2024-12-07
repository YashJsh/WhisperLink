import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists",
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generated Verification Code:", verifyCode);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User is already verified",
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();

                console.log("Saved User:", existingUserByEmail);

                const emailVerification = await sendVerificationEmail(
                    email,
                    username,
                    verifyCode
                );

                if (!emailVerification.success) {
                    return NextResponse.json({
                        success: false,
                        message: "Failed to send verification email",
                    });
                }

                return NextResponse.json({
                    success: true,
                    message: "Verification email resent to existing user",
                    code : verifyCode
                });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();

            console.log("Saved New User:", newUser);

            const emailVerification = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            if (!emailVerification.success) {
                return NextResponse.json({
                    success: false,
                    message: "Failed to send verification email",
                });
            }

            return NextResponse.json({
                success: true,
                message: "Verification email sent successfully",
                code : verifyCode
            });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}




// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bycrypt from "bcryptjs"
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(req : Request) {
//     await dbConnect();
//     try{
//         const {username, email, password} = await req.json();
//         const existingUserVerifiedByUsername = await UserModel.findOne({
//             username, 
//             isVerified : true
//         })
//         if (existingUserVerifiedByUsername){
//             return Response.json({
//                 success: false,
//                 message: "Username already exist"
//             })
//         }
//         const existingUserByEmail = await UserModel.findOne({email})
//         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//         console.log(verifyCode);
//         if (existingUserByEmail){
//             if (existingUserByEmail.isVerified){
//                 return Response.json({
//                     success: false,
//                     message : "User is verified already"
//                 })
//             }else {
//                 const hashedPassword = await bycrypt.hash(password, 10);
//                 existingUserByEmail.password = hashedPassword;
//                 existingUserByEmail.verifyCode = verifyCode;
//                 existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
//                 await existingUserByEmail.save();
//             }
//         }else{  //User is coming for the first time
//             const hashedPassword = await bycrypt.hash(password, 10);
//             const expiryDate = new Date();
//             expiryDate.setHours(expiryDate.getHours()+1);
//             const newUser = new UserModel({
//                 username,
//                 email,
//                 password : hashedPassword,
//                 verifyCode,
//                 verifyCodeExpiry : expiryDate,
//                 isVerified : false,
//                 isAcceptingMessage : true,
//                 messages : []
//             })
//             await newUser.save();
//         }

//         const emailVerification = await sendVerificationEmail(
//             email,
//             username,
//             verifyCode
//         )
//         if (!emailVerification.success) {
//             return Response.json({
//                 success: false,
//                 message: "Failed to send verification email"
//             })
//         }
//         return Response.json({
//             success: true,
//             message: "Verification email sent successfully"
//         })
//     }catch(error){
//         console.error("Error registering user:", error)
//         return Response.json(
//             {
//                 success : false,
//                 message : "Error registering user"
//             }, 
//             {
//                 status : 500
//             }
//         )
//     }
// }