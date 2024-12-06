import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    _id : string;
    content : string;
    createdAt : Date;
}

const MessageSchema : Schema<Message> = new mongoose.Schema({ 
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
    messages : Message[]
}

const UserSchema : Schema<User> = new mongoose.Schema({ 
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : [true, "Email address is required"]
    },
    password : {
        type : String,
        required : [true, "Password is required"] 
    },
    verifyCode : {
        type : String,
        required : [true, "Verify Code  is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "Veriify Code Expiry is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel;