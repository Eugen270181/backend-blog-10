import {Response, Request, NextFunction} from 'express'
import {HttpStatus} from "../types/enum/httpStatus";
import {authServices} from "../../features/auth/services/authServices";
import {ResultStatus} from "../types/enum/resultStatus";
import {IdType} from "../types/id.type";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.sendStatus(HttpStatus.Unauthorized)

    const result = await authServices.checkAccessToken(authHeader);

    if (result.status === ResultStatus.Success) {
        req.user = {userId:result.data!.userId};
        return next();
    }

    return res.sendStatus(HttpStatus.Unauthorized)
}