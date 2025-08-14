import mongoose, { Schema } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MyUser {
    id: string;
    email: string;
    username: string;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema, 'listofUsers')

export default User