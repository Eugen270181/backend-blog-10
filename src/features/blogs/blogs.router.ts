import {Router} from 'express'
import {createBlogController} from './controllers/createBlogController'
import {getBlogsController} from './controllers/getBlogsController'
import {findBlogController} from './controllers/findBlogController'
import {delBlogController} from './controllers/delBlogController'
import {updateBlogController} from './controllers/updateBlogController'
import {blogValidators} from './middlewares/blogValidators'
import {adminMiddleware} from '../../common/middleware/adminMiddleware'
import {findBlogPostsController} from "./controllers/findBlogPostsController";
import {createBlogPostController} from "./controllers/createBlogPostController";
import {blogPostValidators} from "../posts/middlewares/postValidators";
import {querySortSanitizers} from "../../common/middleware/querySortSanitizerMiddleware";

export const blogsRouter = Router()

blogsRouter.get('/', ...querySortSanitizers, getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.get('/:id/posts', ...querySortSanitizers, findBlogPostsController)//new - task-04
blogsRouter.post('/:id/posts', adminMiddleware,...blogPostValidators, createBlogPostController)//new - task-04
blogsRouter.post('/', adminMiddleware,...blogValidators, createBlogController)
blogsRouter.delete('/:id', adminMiddleware, delBlogController)
blogsRouter.put('/:id', adminMiddleware, ...blogValidators, updateBlogController)

// не забудьте добавить роут в апп