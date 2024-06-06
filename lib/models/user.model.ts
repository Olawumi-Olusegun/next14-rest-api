import { Schema, model, models } from "mongoose";


const userSchema = new Schema({
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true}
}, { timestamps: true });


const UserModel = models.User || model("User", userSchema);

export default UserModel;