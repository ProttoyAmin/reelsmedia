import { connectToDatabase } from "@/lib/connectdb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        console.log("Bro's Username : ",username)

        if (!username) {
            return NextResponse.json(
                { error: "Username parameter is required" },
                { status: 400 }
            );
        }

        // Find user by username (case insensitive)
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
            .select('-password -__v') // Exclude sensitive/uneeded fields
            .lean();

        console.log("UserDetails:", user)

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}