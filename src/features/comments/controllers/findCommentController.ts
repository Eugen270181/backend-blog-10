import {Response} from 'express'
import {CommentOutputModel} from "../types/output/commentOutput.model";
import {commentsQueryRepository} from "../repositories/commentsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const findCommentController = async (req: RequestWithParams<IdType>, res: Response<CommentOutputModel>) => {
    const commentId = req.params.id
    const foundComment = await commentsQueryRepository.findCommentAndMap(commentId)

    if (!foundComment) return res.sendStatus(HttpStatus.NotFound)

    return res.status(HttpStatus.Success).send(foundComment)
}