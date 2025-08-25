import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Post, { IPost } from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(request, authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { contentType, text, mediaUrl, mediaType, createdBy, privacy } = await request.json();
        console.log('Backend hit...')

        await connectToDatabase();
        const newPost: IPost = {
            contentType,
            text,
            mediaUrl,
            mediaType,
            createdBy,
            privacy,
        }

        console.log(newPost);
        await Post.create(newPost);
        return NextResponse.json({ message: "Post saved successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}