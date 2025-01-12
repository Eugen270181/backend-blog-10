import {HydratedDocument, Model, Schema} from "mongoose";

export type CommentModel = Model<Comment>

export type CommentDocument = HydratedDocument<Comment>;

export type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type Comment = {
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    postId:string
}

export const commentatorInfoSchema:Schema<CommentatorInfo> = new Schema<CommentatorInfo>({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
})
export const commentSchema:Schema<Comment> = new Schema<Comment>({
    content: { type: String, require: true },
    commentatorInfo: {type: commentatorInfoSchema, require: true },
    createdAt: { type: String, require: true },
    postId: { type: String, require: true },
})

