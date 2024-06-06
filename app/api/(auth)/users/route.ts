import connectDb from "@/lib/database"
import UserModel from "@/lib/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const GET  = async () => {
    try {
     await connectDb();
     const users = await UserModel.find({});
     return NextResponse.json({users}, {status: 200})
   } catch (error) {
    return NextResponse.json({error: "Something went wrong"}, {status: 200})
   }
}

export const POST = async (request: Request) => {

    const { email, password, username } = await request.json();

    try {
        await connectDb();

        const userExist = await UserModel.findOne({email});

        console.log(userExist)

        if(userExist) {
            return NextResponse.json({message: "User already exist"}, {status: 400})
        }

        const newUser = new UserModel({ email, password, username });

        const saveUser = await newUser.save();

        return NextResponse.json({user: saveUser, message: "User created"}, {status: 200})
        
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({error: error?.message}, {status: 500})
    }
}

export const PATCH = async (request: Request) => {

    try {
        
        const { userId, newUsername } = await request.json();
        
        if(!userId || !newUsername) {
            return NextResponse.json({message: "ID or new username not found"}, {status: 400})
        }

        if(!userId || !newUsername || !isValidObjectId(userId)) {
            return NextResponse.json({message: "Invalid user ID"}, {status: 400})
        }

        await connectDb();

        const updatedUser = await UserModel.findOneAndUpdate(
            {_id: userId},
            { username: newUsername },
            {new: true}
             )

        if(!updatedUser) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        return NextResponse.json({user: updatedUser, message: "User created"}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error?.message}, {status: 500})
    }
}

export const DELETE = async (request: Request) => {

    try {

        const {searchParams} = new URL(request.url);
        
        const userId = searchParams.get("userId");
        
        if(!userId) {
            return NextResponse.json({message: "userId not found"}, {status: 400})
        }

        if(!userId || !isValidObjectId(userId)) {
            return NextResponse.json({message: "Invalid user ID"}, {status: 400})
        }

        await connectDb();
        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if(!deletedUser) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }
        return NextResponse.json({message: "User deleted successfully"}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error?.message}, {status: 500})
    }
}