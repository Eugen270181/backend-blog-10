import {Response} from 'express'
import {postsQueryRepository} from "../repository/postsQueryRepository";
import {querySortSanitizer} from "../../../common/module/querySortSanitizer";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {SortQueryFilterType} from "../../../common/types/sortQueryFilter.type";
import {RequestWithQuery} from "../../../common/types/requests.type";
import {SortQueryFieldsType} from "../../../common/types/sortQueryFields.type";
import {Pagination} from "../../../common/types/pagination.type";
import {PostOutputModel} from "../types/output/postOutput.model";

export const getPostsController = async (req: RequestWithQuery<SortQueryFieldsType>, res: Response<Pagination<PostOutputModel[]>>) => {
    const sanitizedSortQuery:SortQueryFilterType = querySortSanitizer(req.query)
    const foundPosts = await postsQueryRepository.getPostsAndMap(sanitizedSortQuery)
    return res.status(HttpStatus.Success).send(foundPosts)
}