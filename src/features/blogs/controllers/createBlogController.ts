import {Response} from 'express'
import {CreateBlogInputModel} from "../types/input/createBlogInput.model";
import {BlogOutputModel} from "../types/output/blogOutput.model";
import {blogsServices} from "../services/blogsServices";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";



export const createBlogController = async (req: RequestWithBody<CreateBlogInputModel>, res: Response<BlogOutputModel>) => {
    const newBlogId = await blogsServices.createBlog(req.body)
    const newBlog = await blogsQueryRepository.findBlogAndMap(newBlogId)

    if (!newBlog) return res.sendStatus(HttpStatus.InternalServerError)
    return res.status(HttpStatus.Created).send(newBlog)
}