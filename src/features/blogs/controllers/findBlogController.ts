import {Response} from 'express'
import {BlogOutputModel} from "../types/output/blogOutput.model";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const findBlogController = async (req: RequestWithParams<IdType>, res: Response<BlogOutputModel | {}>) => {
    const blogId = req.params.id
    const foundBlog = await blogsQueryRepository.findBlogAndMap(blogId)
    if (!foundBlog) return res.sendStatus(HttpStatus.NotFound)
    return res.status(HttpStatus.Success).send(foundBlog)
}