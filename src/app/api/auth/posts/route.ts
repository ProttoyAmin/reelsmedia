import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Post from "@/models/Content";

export async function POST(request: NextRequest){
    try {
        const contents = await request.json();
        
    } catch (error) {
        
    }
}