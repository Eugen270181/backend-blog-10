import {loginValidator, passwordValidator, emailValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";

export const usersValidators = [
    loginValidator,
    passwordValidator,
    emailValidator,

    inputValidationMiddleware,
]