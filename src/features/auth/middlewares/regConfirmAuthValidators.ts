import {codeRegConfirmValidator} from "../../../common/middleware/bodyValidatorsMiddleware";
import {inputValidationMiddleware} from "../../../common/middleware/inputValidationMiddleware";


export const regConfirmAuthValidators = [
    codeRegConfirmValidator,

    inputValidationMiddleware,
]

