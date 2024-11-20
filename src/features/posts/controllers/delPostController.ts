import {Response} from 'express'
import {postsServices} from "../services/postsServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const delPostController = async (req: RequestWithParams<IdType>, res: Response) => {
    const postId = req.params.id;
    const deleteResult = await postsServices.deletePost(postId)
    if(!deleteResult) return res.sendStatus(HttpStatus.NotFound)
    return res.sendStatus(HttpStatus.NoContent)
}