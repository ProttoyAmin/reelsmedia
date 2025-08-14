import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Image from "@/models/Images";

export async function POST(request: NextRequest) {
    try {
        const { caption, fileID, fileType, fileUrl, uploadedBy } = await request.json();
        console.log(uploadedBy)

        if (!fileID || !fileType || !fileUrl || !uploadedBy) {
            return NextResponse.json(
                { error: "File ID, Type, URL and User Email are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        await Image.create(
            {
                caption: caption,
                fileID: fileID,
                fileType: fileType,
                fileUrl: fileUrl,
                uploadedBy: uploadedBy
            }
        );

        return NextResponse.json(
            { message: "File saved successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving image:", error);
        return NextResponse.json(
            { error: "Failed to save image" },
            { status: 500 }
        );
    }
}