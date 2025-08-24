import NextAuth, { NextAuthConfig, Session, User as NextAuthUser } from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "./lib/mongodb";
import User from "./models/User";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }: { user: NextAuthUser }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
          user.id = newUser._id.toString();
          console.log("Created user _id:", newUser._id.toString());
        } else {
          user.id = existingUser._id.toString();
          console.log("Existing user _id:", existingUser._id.toString());
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      // Save the user ID to the token when user signs in
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      if (token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);