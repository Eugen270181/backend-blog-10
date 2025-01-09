import {HydratedDocument} from "mongoose";
import {Blog} from "../../blogs/domain/blog.entity";

export type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentModel = {
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    postId:string
}

export type CommentDocument = HydratedDocument<CommentModel>;