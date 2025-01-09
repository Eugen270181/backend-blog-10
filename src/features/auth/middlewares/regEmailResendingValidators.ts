import {emailResendingValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const regEmailResendingAuthValidators = [
    emailResendingValidator,

    inputValidationMiddleware,
]

