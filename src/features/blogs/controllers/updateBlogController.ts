import {Response} from 'express'
import {UpdateBlogInputModel} from "../types/input/updateblogInput.model";
import {blogsServices} from "../services/blogsServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndBody} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";

export const updateBlogController = async (req: RequestWithParamsAndBody<IdType, UpdateBlogInputModel>, res: Response) => {
    const updateResult = await blogsServices.updateBlog(req.body,req.params.id)
    if (!updateResult) return res.sendStatus(HttpStatus.NotFound)
    return res.sendStatus(HttpStatus.NoContent)
}