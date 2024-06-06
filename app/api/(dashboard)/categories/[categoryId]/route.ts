import connectDb from "@/lib/database";
import CategoryModel from "@/lib/models/category.model";
import UserModel from "@/lib/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

type CategoryParams = {
    categoryId: string;
}


export const PATCH  = async (request: Request, { params }: {params: CategoryParams} ) => {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    const categoryId = params.categoryId;

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!categoryId || !isValidObjectId(categoryId)) {
        return NextResponse.json({message: "Invalid or missing categoryId ID"}, {status: 400}) 
    }

    if(!title) {
        return NextResponse.json({message: "Category title is required"}, {status: 400}) 
    }

    try {
     
     await connectDb();
     const user = await UserModel.findById(userId);
    
     if(!user) {
        return NextResponse.json({message: "Invalid or missing user ID!"}, {status: 404}) 
     }

     const category = await CategoryModel.findOne({ _id: categoryId, user: userId });

     if(!category) {
        return NextResponse.json({message: "Category not found"}, {status: 404}) 
     }

    

     const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId, 
        {title},
        {new: true}
    );

    if(!updatedCategory) {
        return NextResponse.json({message: "Category not found"}, {status: 404}) 
    }

     return NextResponse.json({category: updatedCategory, message: 'Category updated'}, {status: 200});


   } catch (error) {
    return NextResponse.json({error: "Something went wrong"}, {status: 500})
   }
}


export const DELETE = async (request: Request, { params }: {params: CategoryParams}) => {
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { categoryId } = params;

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!categoryId || !isValidObjectId(categoryId)) {
        return NextResponse.json({message: "Invalid or missing category ID"}, {status: 400}) 
    }

    try {
        await connectDb();

      const deletedCategory =  await CategoryModel.findByIdAndDelete(categoryId);

      if(!deletedCategory) {
        return NextResponse.json({message: "Category not found"}, {status: 404}) 
      }

      return NextResponse.json({message: 'Category deleted'}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}