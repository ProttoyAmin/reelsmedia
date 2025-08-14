import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("Please, put MONGO_URI in .env.local file");
}

let connection = global.mongoose;

if (!connection) {
    connection = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectToDatabase() {
    if (connection.conn) {
        return connection.conn
    }

    if (!connection.promise) {
        const options = {
            bufferCommands: true,
            maxPoolSize: 10
        };

        connection.promise = mongoose.connect(MONGO_URI, options).then(() => mongoose.connection)
    }

    try {
        connection.conn = await connection.promise
    } catch (error) {
        connection.promise = null;
        throw error;
    }

    return connection.conn;
}