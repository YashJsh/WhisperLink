import {z} from "zod";

export const MessageSchema = z.object({
   content : z
    .string()
    .min(10, { message: "Message must be at least of 10 characters" })
    .max(500, { message: "Message must be not more than 500 characters" })
})