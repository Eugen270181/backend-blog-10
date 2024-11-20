import {Response, Request} from 'express'
import {authServices} from "../services/authServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";


export const logoutAuthController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized)

    const isLogout = await authServices.logoutUser(refreshToken)

    if (!isLogout) return res.sendStatus(HttpStatus.Unauthorized)

    return res.sendStatus(HttpStatus.NoContent)

}