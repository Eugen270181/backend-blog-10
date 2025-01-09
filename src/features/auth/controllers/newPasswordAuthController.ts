import {Response} from 'express'
import {authServices} from "../services/authServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {RegistrationConfirmationInputModel} from "../types/input/registrationConfirmationInputModel";
import {NewPasswordRecoveryInputModel} from "../types/input/newPasswordRecoveryInput.model";


export const newPasswordAuthController = async (req: RequestWithBody<NewPasswordRecoveryInputModel>, res: Response) => {
    const { newPassword, recoveryCode} = req.body;
    const result = await authServices.confirmPassCodeEmail(newPassword, recoveryCode)

    if (result.status === ResultStatus.BadRequest) return res.status(HttpStatus.BadRequest).send(result.errors)

    return res.sendStatus(HttpStatus.NoContent);
}
