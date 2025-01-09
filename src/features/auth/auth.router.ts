import {Router} from 'express'
import {loginAuthController} from "./controllers/loginAuthController";
import {loginAuthValidators} from "./middlewares/loginAuthValidators";
import {getMeController} from "./controllers/getMeController";
import {accessTokenMiddleware} from "../../common/middleware/accessTokenMiddleware";
import {registrationAuthValidators} from "./middlewares/registrationAuthValidators";
import {routersPaths} from "../../common/settings/paths";
import {registrationAuthController} from "./controllers/registrationAuthController";
import {regConfirmAuthController} from "./controllers/regConfirmAuthController";
import {regConfirmAuthValidators} from "./middlewares/regConfirmAuthValidators";
import {regEmailResendingAuthValidators} from "./middlewares/regEmailResendingValidators";
import {regEmailResendingAuthController} from "./controllers/regEmailResendingAuthController";
import {refreshTokenAuthController} from "./controllers/refreshTokenAuthController";
import {logoutAuthController} from "./controllers/logoutAuthController";
import {rateLimitLoggerMiddleware} from "../../common/middleware/rateLimitLogger/rateLimitLoggerMiddleware";
import {newPasswordAuthController} from "./controllers/newPasswordAuthController";
import {passwordRecoveryAuthController} from "./controllers/passwordRecoveryAuthController";
import {passwordRecoveryAuthValidators} from "./middlewares/passwordRecoveryAuthValidators";
import {newPasswordAuthValidators} from "./middlewares/newPasswordAuthValidators";
export const authRouter = Router()

//testingRouter.use(adminMiddleware)
//login(reqirements - Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds)
authRouter.post(routersPaths.inAuth.login, rateLimitLoggerMiddleware, loginAuthValidators, loginAuthController)
authRouter.get(routersPaths.inAuth.me, accessTokenMiddleware, getMeController)
authRouter.post(routersPaths.inAuth.registration, rateLimitLoggerMiddleware, registrationAuthValidators, registrationAuthController)
authRouter.post(routersPaths.inAuth.registrationConfirmation, rateLimitLoggerMiddleware, regConfirmAuthValidators, regConfirmAuthController)
authRouter.post(routersPaths.inAuth.registrationEmailResending, rateLimitLoggerMiddleware, regEmailResendingAuthValidators, regEmailResendingAuthController)
//logout(reqirements - In cookie client must send correct refreshToken that will be revoked.)
authRouter.post(routersPaths.inAuth.logout, logoutAuthController)
//refresh-token(reqirements - Generate a new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)
authRouter.post(routersPaths.inAuth.refreshToken, refreshTokenAuthController)
//Recovery password 2 endpoints:
authRouter.post(routersPaths.inAuth.passwordRecovery, rateLimitLoggerMiddleware, passwordRecoveryAuthValidators, passwordRecoveryAuthController)
authRouter.post(routersPaths.inAuth.newPassword, rateLimitLoggerMiddleware, newPasswordAuthValidators, newPasswordAuthController)
