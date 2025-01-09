import {
    codePassConfirmValidator,
    codeRegConfirmValidator, passwordRecoveryValidator,
    passwordValidator
} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const newPasswordAuthValidators = [
    passwordRecoveryValidator,
    codePassConfirmValidator,

    inputValidationMiddleware,
]

