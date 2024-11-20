import {Response} from 'express'
import {blogsServices} from "../services/blogsServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const delBlogController = async (req: RequestWithParams<IdType>, res: Response) => {
    const blogId = req.params.id;
    const deleteResult = await blogsServices.deleteBlog(blogId)
    if (!deleteResult) return res.sendStatus(HttpStatus.NotFound)
    return  res.sendStatus(HttpStatus.NoContent)
}