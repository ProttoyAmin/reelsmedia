import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json()
        const { description, thumbnailUrl, title, url, userId, username } = body;

        if (!title || !url || !userId || !username) {
            return NextResponse.json(
                { error: "title, description, URL, user ID, and username are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const newVideo: IVideo = {
            title,
            description,
            url,
            fileID: userId,
            username,
            thumbnailUrl: thumbnailUrl || "",
            controls: true
        }
        console.log(newVideo)
        await Video.create(newVideo);
        return NextResponse.json({ message: "Video saved successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error saving video:", error);
        return NextResponse.json({ error: "Failed to save video" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const fetchAll = searchParams.get("all") === "true";

    await connectToDatabase();

    let videos;
    console.log("Username mediagallery:", username)

    if (!username) {
      videos = await Video.find().sort({ createdAt: -1 }).lean();
    } else {
      videos = await Video.find({ username })
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}