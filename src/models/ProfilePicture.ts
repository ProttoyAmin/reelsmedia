import mongoose from "mongoose";

export interface IProfile {
    imageUrl: string;
    takenBy: string,
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProfileSchema = new mongoose.Schema <IProfile> (
    {
        imageUrl: {
            type: String,
            required: true
        },
        takenBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const ProfilePicture = mongoose.models?.ProfilePicture || mongoose.model<IProfile>("ProfilePicture", ProfileSchema, 'ProfilePictures')

export default ProfilePicture;