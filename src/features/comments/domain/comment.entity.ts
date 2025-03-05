import {HydratedDocument, Model, Schema} from "mongoose";
import {db} from "../../../common/module/db/DB";


export interface ICommentDto {
    content: string,
    postId: string,
    userId: string,
    userLogin: string
}

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export class Comment {
    content: string
    postId: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    deletedAt: Date | null
    likeCount: number = 0
    dislikeCount: number = 0

    static createCommentDocument({content, postId, userId, userLogin}:ICommentDto) {
        const comment = new this()

        comment.content = content
        comment.postId = postId
        comment.commentatorInfo = {
            userId,
            userLogin
        }
        comment.createdAt = new Date()

        const commentModel = db.getModels().CommentModel

        return new commentModel(comment) as CommentDocument
    }
    deleteComment(){
        this.deletedAt = new Date()
    }
    updateComment(content: string) {
        this.content = content
    }
}



export const commentatorInfoSchema:Schema<CommentatorInfo> = new Schema<CommentatorInfo>({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
}, {_id:false})
export const commentSchema:Schema<Comment> = new Schema<Comment>({
    content: { type: String, require: true },
    postId: { type: String, require: true },
    commentatorInfo: { type: commentatorInfoSchema, require: true },
    createdAt: { type: Date, require: true },
    deletedAt: { type: Date, nullable:true, default: null },
    likeCount: { type: Number, required: true, default: 0 },
    dislikeCount: { type: Number, required: true, default: 0 }
})

commentSchema.loadClass(Comment)

export type CommentModelType = Model<Comment>

export type CommentDocument = HydratedDocument<Comment>;
