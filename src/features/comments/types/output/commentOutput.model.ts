import {CommentatorInfo} from "../../models/comment.model";


export type CommentOutputModel = {
    id:string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}