import {Response} from 'express'
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {querySortSanitizer} from "../../../common/module/querySortSanitizer";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithQuery} from "../../../common/types/requests.type";
import {Pagination} from "../../../common/types/pagination.type";
import {BlogOutputModel} from "../types/output/blogOutput.model";
import {BlogsQueryFieldsType} from "../types/blogsQueryFields.type";
import {BlogsQueryFilterType} from "../types/blogsQueryFilter.type";

export const getBlogsController = async (req:RequestWithQuery<BlogsQueryFieldsType>, res:Response<Pagination<BlogOutputModel[]>>) => {
    const sanitizedSortQuery = querySortSanitizer(req.query)
    const searchNameTerm = req.query.searchNameTerm;
    const blogsQueryFilter:BlogsQueryFilterType = {searchNameTerm,...sanitizedSortQuery}

    const foundBlogs = await blogsQueryRepository.getBlogsAndMap(blogsQueryFilter)
    return res.status(HttpStatus.Success).send(foundBlogs)
}