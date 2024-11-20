import {Response} from 'express'
import {usersServices} from "../services/usersServices";
import {usersQueryRepository} from "../repositories/usersQueryRepository";
import {CreateUserInputModel} from "../types/input/createUserInput.type";
import {UserOutputModel} from "../types/output/userOutput.type";
import {OutputErrorsType} from "../../../common/types/outputErrors.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";


export const createUserController = async (req: RequestWithBody<CreateUserInputModel>, res: Response<UserOutputModel|OutputErrorsType>) => {
    const newUserResult = await usersServices.createUser(req.body)

    if (newUserResult.status===ResultStatus.BadRequest) {
        return res.status(HttpStatus.BadRequest).send(newUserResult.errors)
    }

    const newUser = await usersQueryRepository.getMapUser(newUserResult.data!)

    if (!newUser) return res.sendStatus(HttpStatus.InternalServerError)

    return res.status(HttpStatus.Created).send(newUser)
};