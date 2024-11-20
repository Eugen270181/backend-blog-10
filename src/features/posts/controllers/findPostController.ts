import {Response} from 'express'
import {PostOutputModel} from "../types/output/postOutput.model";
import {postsQueryRepository} from "../repository/postsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const findPostController = async (req: RequestWithParams<IdType>, res: Response<PostOutputModel>) => {
    const foundPost = await postsQueryRepository.findPostAndMap(req.params.id)
    if (!foundPost) return res.sendStatus(HttpStatus.NotFound)
    return res.status(HttpStatus.Success).send(foundPost)
}