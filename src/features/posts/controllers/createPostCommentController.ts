import {Response} from 'express'
import {commentsServices} from "../../comments/services/commentsServices";
import {postsRepository} from "../repository/postsRepository";
import {CreateCommentInputModel} from "../../comments/types/input/createCommentInput.model";
import {CommentOutputModel} from "../../comments/types/output/commentOutput.model";
import {commentsQueryRepository} from "../../comments/repositories/commentsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndBodyAndUserId} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";



export const createPostCommentController = async (req: RequestWithParamsAndBodyAndUserId<IdType, CreateCommentInputModel, IdType>, res: Response<CommentOutputModel>) => {
    const userId = req.user?.userId as string;
    const postId = req.params.id
    const foundPost = await postsRepository.findPostById(postId)
    if (!foundPost) return res.sendStatus(HttpStatus.NotFound)

    const {content} = req.body
    const newCommentId = await commentsServices.createComment({content}, postId, userId)
    const newComment = await commentsQueryRepository.findCommentAndMap(newCommentId)

    if (!newComment) return res.sendStatus(HttpStatus.InternalServerError)
    return res.status(HttpStatus.Created).send(newComment)
}