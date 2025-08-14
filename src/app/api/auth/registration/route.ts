import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json()

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Email or Password or Username is required" },
                { status: 400 }
            )
        }

        await connectToDatabase();
        const UserExists = await User.findOne({ username, email })

        if (UserExists?.username === username) {
            return NextResponse.json(
                { error: "User exists" },
                { status: 400 }
            )
        }
        
        if (UserExists?.email === email) {
            return NextResponse.json(
                { error: "Email exists" },
                { status: 400 }
            )
        }
        
        await User.create(
            {
                username: username,
                email: email,
                password: password
            }
        )
        return NextResponse.json(
            { message: "You are added!" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}