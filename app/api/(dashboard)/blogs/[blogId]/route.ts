import connectDb from "@/lib/database";
import BlogModel from "@/lib/models/blog.model";
import CategoryModel from "@/lib/models/category.model";
import UserModel from "@/lib/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

type BlogParamTypes = {
    blogId: string;
}

// GET: localhost:3000/api/blogs?userId=666169154484eb2ece454bf8&categoryId=666169244484eb2ece454bfb
export const GET = async (request: Request, { params }: { params: BlogParamTypes }) => {
    
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { blogId } = params;

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!categoryId || !isValidObjectId(categoryId)) {
        return NextResponse.json({message: "Invalid or missing category ID"}, {status: 400}) 
    }

    if(!blogId || !isValidObjectId(blogId)) {
        return NextResponse.json({message: "Invalid or missing blogId ID"}, {status: 400}) 
    }

    try {
        
        await connectDb();
        const userPromise = UserModel.findById(userId);
        const categoryPromise = CategoryModel.findById(categoryId);

        const [user, category] = await Promise.all([userPromise, categoryPromise]);

        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        if(!category) {
            return NextResponse.json({message: "Category not found"}, {status: 404});
        }

        const blog = await BlogModel.findOne({
            _id: blogId,
            category: category.id,
            user: user.id
        });

        return NextResponse.json({blog}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}

// PATCH: localhost:3000/api/blogs?userId=666169154484eb2ece454bf8
export const PATCH = async (request: Request, { params }: { params: BlogParamTypes }) => {
    
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");
    const { blogId } = params;

    const { title, description } = await request.json();

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }


    if(!blogId || !isValidObjectId(blogId)) {
        return NextResponse.json({message: "Invalid or missing blogId ID"}, {status: 400}) 
    }

    try {

        await connectDb();
        const userPromise = UserModel.findById(userId);
        const blogPromise = BlogModel.findOne({ _id: blogId, user: userId })

        const [user, blog] = await Promise.all([userPromise, blogPromise]);

        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        if(!blog) {
            return NextResponse.json({message: "Blog not found"}, {status: 404});
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(blogId,
            { title, description },
            { new: true }
        );

        if(!updatedBlog) {
            return NextResponse.json({message: "Blog not updatedBlog"}, {status: 404});
        }

        return NextResponse.json({blog: updatedBlog}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}

// DELETE: localhost:3000/api/blogs?userId=666169154484eb2ece454bf8
export const DELETE = async (request: Request, { params }: { params: BlogParamTypes }) => {

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const { blogId } = params;

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!blogId || !isValidObjectId(blogId)) {
        return NextResponse.json({message: "Invalid or missing blogId ID"}, {status: 400}) 
    }

    try {

        await connectDb();
        const userPromise = UserModel.findById(userId);
        const blogPromise = BlogModel.findOne({ _id: blogId, user: userId })

        const [user, blog] = await Promise.all([userPromise, blogPromise]);

        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        if(!blog) {
            return NextResponse.json({message: "Blog not found"}, {status: 404});
        }

        const deletedBlog = await BlogModel.findByIdAndDelete(blogId);

        if(!deletedBlog) {
            return NextResponse.json({message: "Blog not updatedBlog"}, {status: 404});
        }

        return NextResponse.json({message: "Blog deleted"}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}