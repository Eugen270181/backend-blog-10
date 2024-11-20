import {Request, Response} from 'express'
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {authServices} from "../../auth/services/authServices";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {securityRepository} from "../repository/securityRepository";
import {securityServices} from "../services/securityServices";
//TODO
export const delSecurityDevicesController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized) //нет RT
    const checkRT = await authServices.checkRefreshToken(refreshToken)
    if (checkRT.status !== ResultStatus.Success) return res.sendStatus(HttpStatus.Unauthorized) // RT не валиден
    const userId = checkRT.data!.userId
    const currentSessionId = checkRT.data!._id

    const deleteResult = await securityServices.deleteOtherSessions(userId,currentSessionId)

    return  res.sendStatus(HttpStatus.NoContent)
}