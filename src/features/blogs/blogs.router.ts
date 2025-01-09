import {Response, Router} from 'express'
import {blogValidators} from './middlewares/blogValidators'
import {adminMiddleware} from '../../common/middleware/adminMiddleware'
import {blogPostValidators} from "../posts/middlewares/postValidators";
import {querySortSanitizers} from "../../common/middleware/querySortSanitizerMiddleware";
import {blogsController} from "./controllers/blogs.controler";


export const blogsRouter = Router()



blogsRouter.get('/', ...querySortSanitizers, blogsController.getBlogsController.bind(blogsController))
blogsRouter.get('/:id', blogsController.findBlogController.bind(blogsController))
blogsRouter.get('/:id/posts', ...querySortSanitizers, blogsController.findBlogPostsController.bind(blogsController))//new - task-04
blogsRouter.post('/:id/posts', adminMiddleware,...blogPostValidators, blogsController.createBlogPostController.bind(blogsController))//new - task-04
blogsRouter.post('/', adminMiddleware,...blogValidators, blogsController.createBlogController.bind(blogsController))
blogsRouter.delete('/:id', adminMiddleware, blogsController.delBlogController.bind(blogsController))
blogsRouter.put('/:id', adminMiddleware, ...blogValidators, blogsController.updateBlogController.bind(blogsController))

// не забудьте добавить роут в апп