import {Response} from 'express'
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";
import {CreateBlogPostInputModel} from "../../posts/types/input/createBlogPostInput.model";
import {PostOutputModel} from "../../posts/types/output/postOutput.model";
import {postsQueryRepository} from "../../posts/repository/postsQueryRepository";
import {postsServices} from "../../posts/services/postsServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParamsAndBody} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";



export const createBlogPostController = async (req: RequestWithParamsAndBody<IdType, CreateBlogPostInputModel>, res: Response<PostOutputModel>) => {
    const blogId = req.params.id
    const foundBlog = await blogsQueryRepository.findBlogById(blogId)
    if (!foundBlog) return res.sendStatus(HttpStatus.NotFound)
    const newPostId = await postsServices.createPost({...req.body,blogId})
    const newPost = await postsQueryRepository.findPostAndMap(newPostId)

    if (!newPost) return res.sendStatus(HttpStatus.InternalServerError)
    return res.status(HttpStatus.Created).send(newPost)
}