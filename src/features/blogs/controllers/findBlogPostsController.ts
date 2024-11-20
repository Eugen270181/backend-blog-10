import {Response} from 'express'
import {postsQueryRepository} from "../../posts/repository/postsQueryRepository";
import {pagPostOutputModel} from "../../posts/types/output/pagPostOutput.model";
import {querySortSanitizer} from "../../../common/module/querySortSanitizer";
import {blogsRepository} from "../repositories/blogsRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndQuery} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";
import {SortQueryFieldsType} from "../../../common/types/sortQueryFields.type";

export const findBlogPostsController = async (req: RequestWithParamsAndQuery<IdType,SortQueryFieldsType>, res: Response<pagPostOutputModel>) => {
    const blogId = req.params.id
    const foundBlog = await blogsRepository.findBlogById(blogId)
    if (!foundBlog) return res.sendStatus(HttpStatus.NotFound)

    const sanitizedSortQuery = querySortSanitizer(req.query)
    const getPosts = await postsQueryRepository.getPostsAndMap(sanitizedSortQuery,blogId)
    return res.status(HttpStatus.Success).send(getPosts)
}