import {body} from 'express-validator'
import {inputValidationMiddleware} from '../../../common/middleware/inputValidationMiddleware'
import {BlogsRepository} from '../../blogs/repositories/blogsRepository'
import {WithId} from "mongodb";
import {Blog} from "../../blogs/domain/blog.entity";
import {BlogsQueryRepository} from "../../blogs/repositories/blogsQueryRepository";


export const titleValidator = body('title').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 30}).withMessage('more then 30 or 0')
export const shortDescriptionValidator = body('shortDescription').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('more then 100 or 0')
export const contentValidator = body('content').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0')
///////////////////////////////////////////////////////////////////////////////////////////////////////
export const blogIdValidator = body('blogId').isString().withMessage('not string')
    .trim().custom(async (blogId:string) => {
        let blog= await (new BlogsRepository()).findBlogById(blogId)
        if (!blog) {throw new Error('Incorrect blogId!')}
        // console.log(blog)
        return true
    }).withMessage('no blog')

export const postValidators = [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,

    inputValidationMiddleware,
]

export const blogPostValidators = [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,

    inputValidationMiddleware,
]