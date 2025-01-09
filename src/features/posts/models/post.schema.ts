import mongoose from 'mongoose'
import {PostModel} from "./post.model";



export const PostSchema = new mongoose.Schema<PostModel>({
    title: { type: String, require: true }, // max 30
    shortDescription: { type: String, require: true }, // max 100
    content: { type: String, require: true }, // max 1000
    blogId: { type: String, require: true }, // valid
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
})
