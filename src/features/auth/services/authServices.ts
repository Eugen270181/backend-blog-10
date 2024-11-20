import {LoginInputModel} from '../types/input/loginInput.model';
import {hashServices} from '../../../common/adapters/hashServices';
import {usersRepository} from '../../users/repositories/usersRepository';
import {ResultClass} from '../../../common/classes/result.class';
import {ResultStatus} from '../../../common/types/enum/resultStatus';
import {jwtServices} from "../../../common/adapters/jwtServices";
import {nodemailerServices} from "../../../common/adapters/nodemailerServices";
import {User} from "../../users/classes/user.class";
import {CreateUserInputModel} from "../../users/types/input/createUserInput.type";
import {UserDbModel} from "../../users/types/userDb.model";
import {LoginSuccessOutputModel} from "../types/output/loginSuccessOutput.model";
import { add } from 'date-fns/add';
import {appConfig} from "../../../common/settings/config";
import {UserIdType} from "../../../common/types/userId.type";
import {securityRepository} from "../../security/repository/securityRepository";
import {SecurityDbModel} from "../../security/types/securityDb.model";
import {ObjectId, WithId} from "mongodb";
import { v4 as uuidv4 } from 'uuid'
import {randomUUID} from "crypto";
import {securityServices} from "../../security/services/securityServices";

function parseDuration(duration: string) {
    const units: { [key: string]: string } = {
        s: 'seconds',
        m: 'minutes',
        h: 'hours',
        d: 'days',
        M: 'months',
        y: 'years',
    };

    let durationObject: { [key: string]: number } = { seconds: 0, minutes: 0, hours: 0, days: 0, months: 0, years: 0 };

    const regex = /(\d+)([smhdMy])/g;
    let match;

    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = units[match[2]];

        if (unit) {
            durationObject[unit] += value;
        }
    }

    return durationObject;
}

type extLoginSuccessOutputModel = LoginSuccessOutputModel & {refreshToken:string, lastActiveDate:Date}
export const authServices = {
    async loginUser(login:LoginInputModel,ip:string,title:string) {
        let result = new ResultClass<extLoginSuccessOutputModel>()
        const {loginOrEmail, password} = login
        const user= await this.checkUserCredentials(loginOrEmail, password)
        //если логин или пароль не верны или не существуют
        if (user.status !== ResultStatus.Success) {
            result.status = ResultStatus.Unauthorized
            result.addError('Wrong credentials','loginOrEmail|password')
            return result
        }
        //если данные для входа валидны, то генеирруем deviceId и токены RT и AT, кодируя в RT payload {userId,deviceId}
        const _id = new ObjectId()
        const deviceId = _id.toString()
        const userId = user.data!._id.toString()
        //если данные для входа валидны, то генеирруем токены для пользователя и его deviceId
        result = await this.generateTokens(userId,deviceId)
        //создать новую сессию если генерация токенов прошла успешно
        if (result.data) {
            const lastActiveDate = result.data.lastActiveDate;
            const expDate = add( lastActiveDate, parseDuration(appConfig.RT_TIME) );
            const newSession = {_id, ip, title, userId, lastActiveDate, expDate}
            const sid = await securityServices.createSession(newSession)
        }

        return result
    },
    async checkUserCredentials(loginOrEmail: string, password: string) {
        const result = new ResultClass<WithId<UserDbModel>>()
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        // Проверка на наличие пользователя
        if (!user) {
            result.status = ResultStatus.NotFound
            result.addError('User not found','loginOrEmail')
            return result
        }
        // Проверка пароля
        const isPassCorrect = await hashServices.checkHash(password, user.passwordHash);
        if (!isPassCorrect) {
            result.addError('Wrong Password','password')
            return result
        }

        return {
            status: ResultStatus.Success,
            data: user
        }
    },
    //Рефрештокен кодировать с учетом userId и deviceId, а вернуть помимо токенов еще и дату их создания
    async generateTokens(userId:string, deviceId:string){
        const result = new ResultClass<extLoginSuccessOutputModel>()
        //генеирруем токены для пользователя и его deviceid
        const accessToken = await jwtServices.createToken(userId, appConfig.AT_SECRET, appConfig.AT_TIME)
        const refreshToken = await jwtServices.createToken(userId, appConfig.RT_SECRET, appConfig.RT_TIME, deviceId)
        //записываем дату создания RT по user в соответ объект соотв коллекции бд
        const jwtPayload = await jwtServices.decodeToken(refreshToken)
        if (!jwtPayload) {
            result.status = ResultStatus.CancelledAction;
            result.addError('Sorry, something wrong with creation|decode refreshToken, try login later','refreshToken')
            return result
        }
        if ( !(jwtPayload as object).hasOwnProperty("userId") || !(jwtPayload as object).hasOwnProperty("deviceId")
            || !(jwtPayload as object).hasOwnProperty("iat") ) {
            result.status = ResultStatus.CancelledAction;
            result.addError('Sorry, something wrong with creation|decode refreshToken, try login later','refreshToken')
            return result
        }
        const lastActiveDate = new Date((jwtPayload.iat??0)*1000 )

        result.status = ResultStatus.Success
        result.data = {accessToken, refreshToken, lastActiveDate}

        return result
    },
    async refreshTokens(refreshToken: string){
        const result = new ResultClass<extLoginSuccessOutputModel>()
        const foundSession = (await this.checkRefreshToken(refreshToken)).data

        if (!foundSession) return result
        //генерируем новую пару токенов обновляем запись сессии по полю lastActiveDate и expDate
        const newTokens = await this.generateTokens(foundSession.userId,foundSession._id.toString());
        //создать новую сессию если генерация токенов прошла успешно
        if (newTokens.data) {
            const newLastActiveDate = newTokens.data.lastActiveDate;
            const newExpDate = add( newLastActiveDate, parseDuration(appConfig.RT_TIME) );
            const isSessionUpdated = await securityServices.updateSession(newLastActiveDate,newExpDate,foundSession._id)
            if (isSessionUpdated) {
                result.data = newTokens.data
                result.status = ResultStatus.Success
            } else {
                result.status = ResultStatus.CancelledAction
                result.addError('Sorry, something wrong with update date of new session, try again','refreshToken')
            }
        }
        return result
    },
    async checkRefreshToken(refreshToken: string) {
        const result = new ResultClass<WithId<SecurityDbModel>>()
        const jwtPayload = await jwtServices.verifyToken(refreshToken, appConfig.RT_SECRET)

        if (jwtPayload) {
            if ( !(jwtPayload as object).hasOwnProperty("userId") || !(jwtPayload as object).hasOwnProperty("deviceId") )
                throw new Error( `incorrect jwt! ${JSON.stringify(jwtPayload)}` )
            const userId = jwtPayload.userId;
            const deviceId = jwtPayload.deviceId;
            const lastActiveDate = new Date( (jwtPayload.iat??0)*1000 )
            const activeSession = await securityRepository.findActiveSession({userId, deviceId, lastActiveDate})
            if (activeSession) {
                result.data = activeSession
                result.status = ResultStatus.Success
            }
        }

        return result
    },
    async checkAccessToken(authHeader: string) {
        const [type, token] = authHeader.split(" ")
        const result = new ResultClass<UserIdType>()
        const jwtPayload = await jwtServices.verifyToken(token, appConfig.AT_SECRET)

        if (jwtPayload) {
            if (!(jwtPayload as object).hasOwnProperty("userId")) throw new Error(`incorrect jwt! ${JSON.stringify(jwtPayload)}`)
            const userId = jwtPayload.userId;
            const user = await usersRepository.getUserById(userId)
            if (user) { result.data = {userId}; result.status = ResultStatus.Success }
        }

        return result
    },
    async logoutUser(refreshToken: string) {
        const currentSession= await this.checkRefreshToken(refreshToken)
        if (!currentSession.data) return false
        return securityServices.deleteSession(currentSession.data._id)
    },
    async registerUser(user:CreateUserInputModel) {
        const {login, password, email} = user
        const result = new ResultClass()

        if (await usersRepository.findUserByLogin(login)) {
            result.addError("not unique field!", "login")
            return result
        }
        if (await usersRepository.findUserByEmail(email)) {
            result.addError("not unique field!", "email")
            return result
        }

        const passwordHash = await hashServices.getHash(password)
        const newUser = new User(login, email, passwordHash);//create user from constructor of User Class, not from admin - usersServices.createUser

        await usersRepository.createUser(newUser);

        nodemailerServices
            .sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode)
            .catch((er) => console.error('error in send email:', er));

        result.status = ResultStatus.Success
        return result
    },
    async confirmEmail(code: string) {
        const result = new ResultClass()
        const user = await usersRepository.findUserByRegConfirmCode(code)

        if (!user) {
            result.addError('confirmation code is incorrect','code')
            return result
        }
        if (user.emailConfirmation.isConfirmed) {
            result.addError('confirmation code already been applied','code')
            return result
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            result.addError('confirmation code is expired','code')
            return result
        }

        const isUpdateConfirmation = await usersRepository.updateConfirmation(user._id)

        if (!isUpdateConfirmation) {
            result.addError('Something wrong with activate your account, try later','code')
            return result
        }

        result.status = ResultStatus.Success
        return result
    },
    async resendEmail(email:string) {
        const result = new ResultClass()
        const user = await usersRepository.findUserByEmail(email)
        if (!user) {
            result.addError("Users account with this Email not found!", "email")
            return result
        }
        if (user.emailConfirmation.isConfirmed) {
            result.addError('Users account with this email already activated!','email')
            return result
        }
        const newConfirmationCode = randomUUID()
        const newConfirmationDate =add( new Date(), parseDuration(appConfig.EMAIL_TIME) )
        const isUpdateConfirmationCode = await usersRepository.setConfirmationCode(user._id,newConfirmationCode,newConfirmationDate)
        if (!isUpdateConfirmationCode) {
            result.addError('Something wrong with activate your account, try later','email')
            return result
        }
        nodemailerServices
          .sendEmail(email, newConfirmationCode)
          .catch((er) => console.error('error in send email:', er));

        result.status = ResultStatus.Success
        return result
    },
}