import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Post from "@/models/Content";

export async function POST(request: NextRequest) {
    try {
        const contents = await request.json();
        console.log('Backend hit...', contents)
        console.log('Media hit...', contents.media)

    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}