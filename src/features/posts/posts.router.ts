import {Router} from 'express'
import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostsController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/delPostController'
import {updatePostController} from './controllers/updatePostController'
import {postValidators} from './middlewares/postValidators'
import {adminMiddleware} from '../../common/middleware/adminMiddleware'
import {findPostCommentsController} from "./controllers/findPostCommentsController";
import {accessTokenMiddleware} from "../../common/middleware/accessTokenMiddleware";
import {commentValidators} from "../comments/middlewares/commentValidators";
import {createPostCommentController} from "./controllers/createPostCommentController";
import {querySortSanitizers} from "../../common/middleware/querySortSanitizerMiddleware";

export const postsRouter = Router()


postsRouter.get('/', ...querySortSanitizers, getPostsController)
postsRouter.get('/:id', findPostController)
postsRouter.get('/:id/comments', ...querySortSanitizers, findPostCommentsController)//new - task-06
postsRouter.post('/:id/comments', accessTokenMiddleware,...commentValidators, createPostCommentController)//new - task-06
postsRouter.post('/',  adminMiddleware, ...postValidators, createPostController)
postsRouter.delete('/:id',  adminMiddleware, delPostController)
postsRouter.put('/:id', adminMiddleware, ...postValidators, updatePostController)

// не забудьте добавить роут в апп