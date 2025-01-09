import {Response} from 'express'
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {RegistrationEmailResendingInputModel} from "../types/input/registrationEmailResendingInputModel";
import { authServices } from '../services/authServices';
import { ResultStatus } from '../../../common/types/enum/resultStatus';
import {PasswordRecoveryInputModel} from "../types/input/passwordRecoveryInput.model";


export const passwordRecoveryAuthController = async (req: RequestWithBody<PasswordRecoveryInputModel>, res: Response) => {
    const {email} = req.body
    const result = await authServices.resendPassCodeEmail(email)

    if (result.status === ResultStatus.BadRequest) return res.status(HttpStatus.BadRequest).send(result.errors)

    return res.sendStatus(HttpStatus.NoContent)
}
