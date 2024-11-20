import {emailValidator, loginValidator, passwordValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const registrationAuthValidators = [
    passwordValidator,
    loginValidator,
    emailValidator,

    inputValidationMiddleware,
]

