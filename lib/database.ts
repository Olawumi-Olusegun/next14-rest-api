import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;


const connectDb = async () => {
    const connectionState = mongoose.connection.readyState;
    if(connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if(connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URL, {
            bufferCommands: true
        })
    } catch (error: any) {
        console.log('Error: ', error);
        throw new Error("Error: ", error);
    }
}

export default connectDb;