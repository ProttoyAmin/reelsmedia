import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/connectdb";
import User from "@/models/User";
import { MyUser } from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider(
            {
                name: "Credentials",
                credentials: {
                    email: { label: "Email", type: "email", placeholder: "Enter your email" },
                    password: { label: "Password", type: "password", placeholder: "Enter your password" }
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email, username and password are required");
                    }

                    try {
                        await connectToDatabase();
                        const user = await User.findOne({ email: credentials.email });

                        if (!user) {
                            throw new Error("User not found");
                        }

                        const isValidPassword = user.password === credentials.password;
                        if (!isValidPassword) {
                            throw new Error("Invalid password");
                        }
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            username: user.username
                        }
                    } catch (error) {
                        throw new Error("Authorization failed. Email or password is wrong");
                    }
                }
            }
        )
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const myUser = user as MyUser;
                token.id = myUser.id;
                token.email = myUser.email;
                token.username = myUser.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}