import {Router} from 'express'
import {commentValidators} from "./middlewares/commentValidators";

import {delCommentController} from "./controllers/delCommentController";
import {updateCommentController} from "./controllers/updateCommentController";
import {accessTokenMiddleware} from "../../common/middleware/accessTokenMiddleware";
import {findCommentController} from "./controllers/findCommentController";


export const commentsRouter = Router()

commentsRouter.get('/:id', findCommentController)
commentsRouter.put('/:id', accessTokenMiddleware,...commentValidators, updateCommentController)
commentsRouter.delete('/:id', accessTokenMiddleware, delCommentController)


// не забудьте добавить роут в апп