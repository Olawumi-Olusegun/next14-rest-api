import connectDb from "@/lib/database";
import BlogModel from "@/lib/models/blog.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";




// GET: localhost:3000/api/blogs?userId=666169154484eb2ece454bf8&categoryId=666169244484eb2ece454bfb
export const GET = async (request: Request) => {
    
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate") as string;
    const endDate = searchParams.get("endDate") as string;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!categoryId || !isValidObjectId(categoryId)) {
        return NextResponse.json({message: "Invalid or missing category ID"}, {status: 400}) 
    }

    const blogFilters: any = {
        user: userId,
        category: categoryId,
    }

    if(searchKeywords) {
        blogFilters.$or = [
            { title: { $regex: searchKeywords, $options: "i" } },
            { description: { $regex: searchKeywords, $options: "i" } },
        ]
    }

    if(startDate && endDate) {
        blogFilters.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        }
    } else if(startDate) {
        blogFilters.createdAt = {
            $gte: new Date(startDate),
        }
    } else if(endDate) {
        blogFilters.createdAt = {
            $lte: new Date(endDate),
        }
    }

    try {
        
        await connectDb();
        const blogs = await BlogModel.find(blogFilters)
        .sort({ createdAt: "asc" })
        .skip(skip)
        .limit(limit);

        return NextResponse.json({blogs}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }
}

// POST: localhost:3000/api/blogs?userId=666169154484eb2ece454bf8&categoryId=666169244484eb2ece454bfb

export const POST = async (request: Request) => {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { title, description } = await request.json();

    if(!userId || !isValidObjectId(userId)) {
        return NextResponse.json({message: "Invalid or missing user ID"}, {status: 400}) 
    }

    if(!categoryId || !isValidObjectId(categoryId)) {
        return NextResponse.json({message: "Invalid or missing category ID"}, {status: 400}) 
    }

    try {
        await connectDb();
        const newBlog = new BlogModel({title, user: userId, category: categoryId, description});

        const savedBlog = await newBlog.save();

        if(!savedBlog) {
            return NextResponse.json({message: "Blog not created"}, {status: 400});
        }

        return NextResponse.json({blog: savedBlog, message: "Blog created"}, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}

