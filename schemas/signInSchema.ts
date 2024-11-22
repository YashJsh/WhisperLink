import {z} from "zod";

export const SignInSchema = z.object({
    email : z.string().email({message : "Invalid Email Address"}),
    password : z.string().min(6, {message : "Minimum should be 6 character"})
})