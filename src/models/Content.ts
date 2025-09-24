import mongoose from "mongoose";

export type MediaType = 'image' | 'video';
export type ContentType = 'status' | 'image' | 'video';
export type PrivacyType = 'public' | 'friends' | 'private';

export interface IPost extends mongoose.Document {
    contentType: ContentType;
    text?: string;
    mediaUrl?: string;
    mediaType?: MediaType;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: mongoose.Types.ObjectId[];
    comments?: mongoose.Types.ObjectId[];
    tags?: string[];
    privacy: PrivacyType;
}

const PostSchema: mongoose.Schema = new mongoose.Schema<IPost>(
    {
        contentType: {
            type: String,
            enum: ['status', 'image', 'video'],
            required: true
        },
        text: {
            type: String,
            default: ''
        },
        mediaUrl: {
            type: String,
            required: function () {
                return this.contentType === 'image' || this.contentType === 'video';
            }
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            required: function () {
                return this.contentType === 'image' || this.contentType === 'video';
            }
        },
        createdBy: {
            type: String,
            required: true
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
        }],
        tags: {
            type: [String],
            default: []
        },
        privacy: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        }
    },
    {
        timestamps: true
    }
);

const Post = mongoose.models?.Post || mongoose.model<IPost>('Post', PostSchema, 'Posts');
export default Post;