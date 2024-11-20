import {Response} from 'express'
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {EmailResendingInputModel} from "../types/input/emailResendingInput.model";
import { authServices } from '../services/authServices';
import { ResultStatus } from '../../../common/types/enum/resultStatus';


export const emailResendingAuthController = async (req: RequestWithBody<EmailResendingInputModel>, res: Response) => {
    const {email} = req.body
    const result = await authServices.resendEmail(email)

    if (result.status === ResultStatus.BadRequest) return res.status(HttpStatus.BadRequest).send(result.errors)

    return res.sendStatus(HttpStatus.NoContent)
}
