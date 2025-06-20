import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//it will get user in return
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token._id = user._id?.toString(); 
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
        }
        return token;
    },
    async session({ session, token }) {
        if  (token){
          session.user._id = token._id;
          session.user.username = token.username;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessages = token.isAcceptingMessages;
        }
        return session;
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
 