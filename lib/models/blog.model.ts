import { Schema, model, models } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
}, { timestamps: true });

const BlogModel = models.Blog || model("Blog", blogSchema);

export default BlogModel;