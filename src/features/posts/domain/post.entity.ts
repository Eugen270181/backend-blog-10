import {Model, HydratedDocument, Schema} from 'mongoose';
import {db} from "../../../common/module/db/DB";


export interface IPostDto {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}
export class Post {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    deletedAt: Date | null

    static createPostDocument({title, shortDescription, content, blogId, blogName}: IPostDto) {
        const post = new this()

        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = blogId
        post.blogName = blogName
        post.createdAt = new Date()

        const postModel = db.getModels().PostModel

        return new postModel(post) as PostDocument
    }
    deletePost(){
        this.deletedAt = new Date()
    }
    updatePost({title, shortDescription, content, blogId, blogName}: IPostDto) {
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = blogName
    }
}

export const postSchema:Schema<Post> = new Schema<Post>({
    title: { type: String, require: true }, // max 30
    shortDescription: { type: String, require: true }, // max 100
    content: { type: String, require: true }, // max 1000
    blogId: { type: String, require: true }, // valid
    blogName: { type: String, require: true },
    createdAt: { type: Date, require: true },
    deletedAt: { type: Date, nullable:true, default: null }
})

postSchema.loadClass(Post)

export type PostModelType = Model<Post>

export type PostDocument = HydratedDocument<Post>


