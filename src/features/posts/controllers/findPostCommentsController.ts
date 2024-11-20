import {Response} from 'express'
import {commentsQueryRepository} from "../../comments/repositories/commentsQueryRepository";
import {querySortSanitizer} from "../../../common/module/querySortSanitizer";
import {pagCommentOutputModel} from "../../comments/types/output/pagCommentOutput.model";
import {postsRepository} from "../repository/postsRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndQuery} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";
import {SortQueryFieldsType} from "../../../common/types/sortQueryFields.type";

export const findPostCommentsController = async (req:RequestWithParamsAndQuery<IdType, SortQueryFieldsType>, res:Response<pagCommentOutputModel>) => {
    const postId = req.params.id
    const foundPost = await postsRepository.findPostById(postId)
    if (!foundPost) return res.sendStatus(HttpStatus.NotFound)
    const sanitizedSortQuery = querySortSanitizer(req.query)

    const foundComments = await commentsQueryRepository.getCommentsAndMap(sanitizedSortQuery,postId)
    return res.status(HttpStatus.Success).send(foundComments)
}