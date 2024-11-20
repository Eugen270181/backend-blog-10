import {Response, Request} from 'express'
import {authServices} from "../services/authServices";
import {LoginSuccessOutputModel} from "../types/output/loginSuccessOutput.model";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {ResultStatus} from "../../../common/types/enum/resultStatus";



export const refreshTokenAuthController = async (req: Request, res: Response<LoginSuccessOutputModel>) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HttpStatus.Unauthorized)

    const result = await authServices.refreshTokens(refreshToken)

    if (result.status === ResultStatus.Success) {
        res.cookie("refreshToken",result.data!.refreshToken,{
            httpOnly: true,
            secure: true,
        });

        return res.status(HttpStatus.Success).send({accessToken:result.data!.accessToken})
    }

    return res.sendStatus(HttpStatus.Unauthorized)

}