import {Router} from 'express'
import {usersValidators} from "./middlewares/usersValidators";
import {adminMiddleware} from "../../common/middleware/adminMiddleware";
import {getUsersController} from "./controllers/getUsersController";
import {createUserController} from "./controllers/createUserController";
import {delUserController} from "./controllers/delUserController";


export const usersRouter = Router()

usersRouter.get('/', getUsersController)
usersRouter.post('/', adminMiddleware,...usersValidators, createUserController)
usersRouter.delete('/:id', adminMiddleware, delUserController)


// не забудьте добавить роут в апп