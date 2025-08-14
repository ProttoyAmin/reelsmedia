import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;

export interface VideoFormData {
    title: string;
    description: string;
    videoFile: FileList;
}

export interface IVideo {
    title: string;
    url: string;
    fileID: string;
    username: string;
    description?: string;
    thumbnailUrl?: string;
    controls?: boolean;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    };
}

const VideoSchema = new mongoose.Schema<IVideo>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        url: {
            type: String,
            required: true
        },
        thumbnailUrl: {
            type: String,
            default: ""
        },
        controls: {
            type: Boolean,
            default: true
        },
        transformation: {
            height: { type: Number, default: VIDEO_DIMENSIONS.height },
            width: { type: Number, default: VIDEO_DIMENSIONS.width },
            quality: { type: Number, min: 1, max: 100 },
        },
        fileID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Video = mongoose.models?.Video || mongoose.model<IVideo>('Video', VideoSchema, 'listofVideos');
export default Video;