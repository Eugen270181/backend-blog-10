import {Request, Response} from 'express'
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {authServices} from "../../auth/services/authServices";
import {SecurityOutputModel} from "../types/output/securityOutput.model";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {securityServices} from "../services/securityServices";
import {securityQueryRepository} from "../repository/securityQueryRepository";
//TODO
export const getSecurityDevicesController = async (req: Request, res: Response<SecurityOutputModel[]>) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized)

    const checkRT = await authServices.checkRefreshToken(refreshToken)
    if (checkRT.status !== ResultStatus.Success) return res.sendStatus(HttpStatus.Unauthorized)

    const sessions = await securityQueryRepository.getActiveSessionsAndMap(checkRT.data!.userId)

    return res.status(HttpStatus.Success).send(sessions)

}