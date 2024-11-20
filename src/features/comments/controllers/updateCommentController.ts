import {Response} from 'express'
import {commentsServices} from "../services/commentsServices";
import {CreateCommentInputModel} from "../types/input/createCommentInput.model";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndBodyAndUserId} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";


export const updateCommentController = async (req: RequestWithParamsAndBodyAndUserId<IdType, CreateCommentInputModel, IdType>, res: Response) => {

    const userId = req.user?.userId as string;
    const commentId = req.params.id
    const {content} = req.body
    const updateResult = await commentsServices.updateComment({content}, commentId, userId)

    if (updateResult===ResultStatus.NotFound) return res.sendStatus(HttpStatus.NotFound)
    if (updateResult===ResultStatus.Forbidden) return res.sendStatus(HttpStatus.Forbidden)
    if (updateResult === ResultStatus.CancelledAction) return res.sendStatus(HttpStatus.InternalServerError)

    return res.sendStatus(HttpStatus.NoContent)
};