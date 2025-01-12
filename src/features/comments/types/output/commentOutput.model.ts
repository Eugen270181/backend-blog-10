import {CommentatorInfo} from "../../domain/comment.entity";


export type CommentOutputModel = {
    id:string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}