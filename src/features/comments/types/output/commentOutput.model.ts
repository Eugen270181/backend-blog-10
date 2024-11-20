import {commentatorInfo} from "../commentDb.model";

export type CommentOutputModel = {
    id:string
    content: string
    commentatorInfo: commentatorInfo
    createdAt: string
}