import { resend } from "@/lib/resend";
import VerificationEmail from "@/emailTemplates/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode : string
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return { success : false, message : "Failed to send verification Email"}
    }
    catch(err){
        console.error("Error sending verification email");
        return { success : false, message : "Failed to send verification Email"}

    }
}