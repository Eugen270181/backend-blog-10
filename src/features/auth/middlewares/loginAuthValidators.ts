import {loginOrEmailValidator, passwordValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const loginAuthValidators = [
    loginOrEmailValidator,

    inputValidationMiddleware,
]

