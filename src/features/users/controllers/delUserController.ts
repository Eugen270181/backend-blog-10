import {Response} from 'express'
import {usersServices} from "../services/usersServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";


export const delUserController = async (req: RequestWithParams<IdType>, res: Response) => {
    const userId = req.params.id
    const deleteResult = await usersServices.deleteUser(userId)
    if (!deleteResult) return res.sendStatus(HttpStatus.NotFound)
    return  res.sendStatus(HttpStatus.NoContent)
}