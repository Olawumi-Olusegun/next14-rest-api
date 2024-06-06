import connectDb from "@/lib/database";
import CategoryModel from "@/lib/models/category.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const GET  = async (request: Request) => {

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    try {
     await connectDb();
     const user = await CategoryModel.findById(userId);
    
     if(!user) {
        return NextResponse.json({message: "Invalid or missing user ID!"}, {status: 404}) 
     }

     const categories = await CategoryModel.find({ user: userId });

     return NextResponse.json({categories}, {status: 200});
     
   } catch (error) {
    return NextResponse.json({error: "Something went wrong"}, {status: 500})
   }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const { title } = await request.json();

        if(!userId) {
            return NextResponse.json({message: "User ID is required"}, {status: 400}) 
        }

        if(!isValidObjectId(userId)) {
            return NextResponse.json({message: "Invalid user ID!"}, {status: 400}) 
        }

        if(!title) {
            return NextResponse.json({message: "Category title required"}, {status: 400}) 
        }

        const newCategory = new CategoryModel({title, user: userId});

        const savedCategory = await newCategory.save();

        return NextResponse.json({category: savedCategory}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}