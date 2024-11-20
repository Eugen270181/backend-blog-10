import {Response} from 'express'
import {CreatePostInputModel} from "../types/input/createPostInput.model";
import {PostOutputModel} from "../types/output/postOutput.model";
import {postsServices} from "../services/postsServices";
import {postsQueryRepository} from "../repository/postsQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";

export const createPostController = async (req: RequestWithBody<CreatePostInputModel>, res: Response<PostOutputModel>) => {
    const newPostId = await postsServices.createPost(req.body)
    const newPost = await postsQueryRepository.findPostAndMap(newPostId)

    if (!newPost) return res.sendStatus(HttpStatus.InternalServerError)

    return res.status(HttpStatus.Created).send(newPost)
}