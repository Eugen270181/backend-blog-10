import {Response} from 'express'
import {authServices} from "../services/authServices";
import {HttpStatus} from "../../../common/types/enum/httpStatus";
import {RequestWithBody} from "../../../common/types/requests.type";
import {CreateUserInputModel} from "../../users/types/input/createUserInput.type";
import {ResultStatus} from "../../../common/types/enum/resultStatus";


export const registrationAuthController = async (req: RequestWithBody<CreateUserInputModel>, res: Response) => {

    const result = await authServices.registerUser( req.body )

    if (result.status === ResultStatus.BadRequest) return res.status(HttpStatus.BadRequest).send(result.errors)

    return res.sendStatus(HttpStatus.NoContent)
}
