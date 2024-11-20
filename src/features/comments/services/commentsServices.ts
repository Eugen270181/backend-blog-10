import {commentsRepository} from "../repositories/commentsRepository";
import {ObjectId} from "bson";
import {CreateCommentInputModel} from "../types/input/createCommentInput.model";
import {CommentDbModel} from "../types/commentDb.model";
import {UpdateCommentInputModel} from "../types/input/updateCommentInput.model";
import {usersRepository} from "../../users/repositories/usersRepository";
import {ResultStatus} from "../../../common/types/enum/resultStatus";



export const commentsServices = {
    async createComment(commentInput: CreateCommentInputModel, postId:string, userId:string) {
        const user=await usersRepository.getUserById(userId)
        const {content} = commentInput
        const newComment:CommentDbModel = {
            content,
            commentatorInfo:{userId:user!._id.toString(),userLogin:user!.login},
            createdAt: new Date().toISOString(),
            postId
        }
        return commentsRepository.createComment(newComment)
    },
    async deleteComment(id:string, userId:string){
        const isIdValid = ObjectId.isValid(id)
        if (!isIdValid) return ResultStatus.NotFound
        const comment=await commentsRepository.findCommentById(id)
        if (!comment) return ResultStatus.NotFound
        if (comment.commentatorInfo.userId!==userId) return ResultStatus.Forbidden
        const isDeleted = await commentsRepository.deleteComment(new ObjectId(id))
        return isDeleted?ResultStatus.NoContent:ResultStatus.CancelledAction
    },
    async updateComment(commentInput: UpdateCommentInputModel, id: string, userId:string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return ResultStatus.NotFound
        const comment=await commentsRepository.findCommentById(id)
        if (!comment) return ResultStatus.NotFound
        if (comment.commentatorInfo.userId!==userId) return ResultStatus.Forbidden
        const {content} = commentInput
        const isUpdated = await commentsRepository.updateComment({content},id)
        return isUpdated?ResultStatus.NoContent:ResultStatus.CancelledAction
    },
}