import {emailPassRecoveryValidator, emailResendingValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const passwordRecoveryAuthValidators = [
    emailPassRecoveryValidator,

    inputValidationMiddleware,
]

