import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Image from "@/models/Images";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    console.log("Params", searchParams)
    
    const username = searchParams.get('username')

    await connectToDatabase();

    let images;

    if (!username) {
      images = await Image.find().sort({ createdAt: -1 }).lean();
    } else {
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      images = await Image.find({ uploadedBy: username })
        .sort({ createdAt: -1 })
        .lean();
    }
    console.log("USER IMAGES: ", images)

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}