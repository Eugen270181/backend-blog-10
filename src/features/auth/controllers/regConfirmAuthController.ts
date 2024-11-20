import {Response} from 'express'
import {authServices} from "../services/authServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";
import {RegConfirmInputModel} from "../types/input/regConfirmInput.model";

export const regConfirmAuthController = async (req: RequestWithBody<RegConfirmInputModel>, res: Response) => {
    const {code} = req.body;
    const result = await authServices.confirmEmail(code)

    if ( result.status === ResultStatus.BadRequest ) {
        return res.status(HttpStatus.BadRequest).send(result.errors)
    }

    return res.sendStatus(HttpStatus.NoContent);
}
