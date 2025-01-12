import {Model, HydratedDocument, Schema} from 'mongoose';


export type PostModel = Model<Post>

export type PostDocument = HydratedDocument<Post>

export class Post {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    deletedAt: Date | null
    constructor(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = blogName
        this.createdAt = new Date()
        this.deletedAt = null
    }
}

export const postSchema:Schema<Post> = new Schema<Post>({
    title: { type: String, require: true }, // max 30
    shortDescription: { type: String, require: true }, // max 100
    content: { type: String, require: true }, // max 1000
    blogId: { type: String, require: true }, // valid
    blogName: { type: String, require: true },
    createdAt: { type: Date, require: true },
    deletedAt: { type: Date, required: true, default: null },
})


