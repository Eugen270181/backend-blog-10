import {Request, Response} from 'express'
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithParams} from "../../../common/types/requests.type";
import {IdType} from "../../../common/types/id.type";
import {commentsServices} from "../../comments/services/commentsServices";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {authServices} from "../../auth/services/authServices";
import {securityServices} from "../services/securityServices";
import {securityRepository} from "../repository/securityRepository";
//TODO
export const delSecurityDeviceController = async (req: RequestWithParams<IdType>, res: Response) => {
    const sid = req.params.id
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized) //нет RT
    const checkRT = await authServices.checkRefreshToken(refreshToken)
    if (checkRT.status !== ResultStatus.Success) return res.sendStatus(HttpStatus.Unauthorized) // RT не валиден
    const userId = checkRT.data!.userId

    const foundSession = await securityRepository.findSessionById(sid)
    if (!foundSession) return res.sendStatus(HttpStatus.NotFound) //не найдена сессия - sid = deviceId

    if (foundSession.userId !== userId) return res.sendStatus(HttpStatus.Forbidden) //userId из входного RT - !owner foundSession

    const deleteResult = await securityServices.deleteSession(foundSession._id)

    return  res.sendStatus(HttpStatus.NoContent)
}