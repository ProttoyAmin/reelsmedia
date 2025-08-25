import mongoose from "mongoose";

export type ImageFormData = {
  caption: string
  image: FileList
}

export interface IImage {
    fileID: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    caption?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const ImageSchema = new mongoose.Schema<IImage>(
    {
        caption: {
            type: String,
            default: '',
        },
        fileID: {
            type: String,
            required: true,
            unique: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Image = mongoose.models?.Image || mongoose.model<IImage>('Image', ImageSchema, 'listofImages');
export default Image;