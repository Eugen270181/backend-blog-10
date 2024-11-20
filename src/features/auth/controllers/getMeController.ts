import {Response} from 'express'
import {MeOutputModel} from "../types/output/meOutput.model";
import {usersQueryRepository} from "../../users/repositories/usersQueryRepository";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {IdType} from "../../../common/types/id.type";
import {RequestWithUserId} from "../../../common/types/requests.type";


export const getMeController = async (req: RequestWithUserId<IdType>, res: Response<MeOutputModel|{}>) => {
    const userId = req.user?.userId as string;
    const meViewObject = await usersQueryRepository.getMapMe(userId)
    return res.status(HttpStatus.Success).send(meViewObject)
}