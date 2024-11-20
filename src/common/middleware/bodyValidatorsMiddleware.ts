import {body} from 'express-validator'
import {usersRepository} from "../../features/users/repositories/usersRepository";

const uniqueLoginValidator = async (login: string) => {
    const user = await usersRepository.findUserByLogin(login);
    if (user) throw new Error("login already exist")
    return true
}
const uniqueEmailValidator = async (email: string) => {
    const user = await usersRepository.findUserByEmail(email);
    if (user) throw new Error("email already exist")
    return true
}

const EmailValidator = async (email: string) => {
    const user = await usersRepository.findUserByEmail(email);

    if (!user) throw new Error("Users account with this Email not found!")
    if (user.emailConfirmation.isConfirmed) throw new Error("Users account with this email already activated!")

    return true
}

const checkRegConfirmCode = async (code:string) =>{
    const user = await usersRepository.findUserByRegConfirmCode(code)
    if (!user) throw new Error("Don't found this confirmation code")
    if (user.emailConfirmation.isConfirmed) throw new Error("This User already confirmed")
    if (user.emailConfirmation.expirationDate < new Date()) throw new Error("This code already expired")
    return true
}
export const loginValidator = body('login').isString().withMessage('Login must be a string')
    .trim().isLength({ min: 3, max: 10 }).withMessage('Login must be between 3 and 10 characters long')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login must contain only letters, numbers, underscores, and hyphens')
    .custom(uniqueLoginValidator)
export const emailValidator = body('email').isString().withMessage('Email must be a string')
    .trim().isEmail().withMessage('Email must be a valid email address')
    .custom(uniqueEmailValidator)
export const passwordValidator = body('password').isString().withMessage('Password must be a string')
    .trim().isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters long')
export const loginOrEmailValidator = body('loginOrEmail').isString().withMessage('not string')
export const codeRegConfirmValidator = body('code').isUUID(4).withMessage('Code is not UUID format').trim()
    .custom(checkRegConfirmCode)
export const emailResendingValidator = body('email').isString().withMessage('Email must be a string')
  .trim().isEmail().withMessage('Email must be a valid email address').custom(EmailValidator)



