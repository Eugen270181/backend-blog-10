import {Router} from 'express'
import {routersPaths} from "../../common/settings/paths";
import {getSecurityDevicesController} from "./controllers/getSecurityDevicesController";
import {delSecurityDevicesController} from "./controllers/delSecurityDevicesController";
import {delSecurityDeviceController} from "./controllers/delSecurityDeviceController";

export const securityRouter = Router()

securityRouter.get(routersPaths.inSecurity, getSecurityDevicesController)
securityRouter.delete(routersPaths.inSecurity, delSecurityDevicesController)
securityRouter.delete(routersPaths.inSecurity+'/:id', delSecurityDeviceController)


