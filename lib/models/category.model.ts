
import { Schema, model, models } from "mongoose";


const categorySchema = new Schema({
    title: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });


const CategoryModel = models.Category || model("Category", categorySchema);

export default CategoryModel;