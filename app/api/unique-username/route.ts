import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){  
    await dbConnect();
    try{
        const url = new URL(request.url);
        const queryParam = {
            username : url.searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success){
            return Response.json({
                success : false,
                message: 'Invalid query parameter' 
            }, {status : 400})
        }
        const username = result.data.username;
        const user = await UserModel.findOne({username, isVerified : true})
        if (!user){
            return Response.json({
                    success : true,
                    message : "Username is available"
                })
        }
        return Response.json({
            success : true,
            message : "Username is already taken "
            }, { status: 200 }
        )
    } catch(error){
        console.error("Error Checking username", error);
        return Response.json({
            success : false,
            message : "Error CHecking username"
        },
        {
            status: 500
        })  
    }
}