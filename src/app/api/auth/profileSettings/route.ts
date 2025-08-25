import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import ProfilePicture from "@/models/ProfilePicture";

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, takenBy } = await request.json()
        console.log("Data: ", imageUrl, takenBy)

        if (!imageUrl || !takenBy) {
            return NextResponse.json(
                { error: "Image URL and Username are required" },
                { status: 400 }
            )
        }

        await connectToDatabase();
        const doesExist = await ProfilePicture.findOne({ takenBy });

        if (doesExist) {
            await ProfilePicture.findByIdAndUpdate(doesExist._id, {
                imageUrl,
                takenBy,
                updatedAt: new Date()
            });

            return NextResponse.json(
                { error: "Profile picture updated" },
                { status: 409 }
            );
        }
        await ProfilePicture.create(
            {
                imageUrl,
                takenBy
            }
        )

        return NextResponse.json(
            { message: "Saved successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error saving image:", error);
        return NextResponse.json(
            { error: "Failed to save image" },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        console.log("searchParams:::", searchParams)
        const username = searchParams.get('username');
        console.log("Username::::", username)
        
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const data = await ProfilePicture.findOne({ takenBy: username });

        console.log("Profile Image data: ", data);

        if (!data) {
            return NextResponse.json(
                { message: "No profile picture found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error getting image:", error);
        return NextResponse.json(
            { error: "Failed to get image" },
            { status: 500 }
        );
    }
}