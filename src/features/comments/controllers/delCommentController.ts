import {Response} from 'express'
import {commentsServices} from "../services/commentsServices";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndUserId} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";


export const delCommentController = async (req: RequestWithParamsAndUserId<IdType,IdType>, res: Response) => {
    const userId = req.user?.userId as string
    const commentId = req.params.id
    const deleteResult = await commentsServices.deleteComment(commentId,userId)

    if (deleteResult === ResultStatus.NotFound) return res.sendStatus(HttpStatus.NotFound)
    if (deleteResult === ResultStatus.Forbidden) return res.sendStatus(HttpStatus.Forbidden)
    if (deleteResult === ResultStatus.CancelledAction) return res.sendStatus(HttpStatus.InternalServerError)

    return  res.sendStatus(HttpStatus.NoContent)
}