import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { loggMiddleware } from "./middlewares/api/logMiddlewares";

export const config = {
    matcher: "/api/:path*",
}

export default function middleware(request: Request) {
    
    const authResult = authMiddleware(request);

    if(request.url.includes("/api/blogs")) {
        const logResult = loggMiddleware(request);
        console.log(logResult);
    }

    //  && request.url.includes("/api/blogs")
    if(!authResult?.isValid) {
        return NextResponse.json({ message: "Unauthorized"}, { status: 401})
    }
    return NextResponse.next();
}