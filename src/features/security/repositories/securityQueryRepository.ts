import {db} from "../../../common/module/db/db"
import {ObjectId, WithId} from "mongodb"
import {SecurityOutputModel} from "../types/output/securityOutput.model";
import {SessionModel} from "../models/session.model";

export const securityQueryRepository = {
    async getActiveSessionsAndMap(userId?:string):Promise<SecurityOutputModel[]> { // используем этот метод если проверили валидность и существование в бд значения blogid
        const dateNow = new Date();
        const filter = {"expDate":{ $gt:dateNow }, ...(userId && { userId })}

        try {
            const sessions = await db.getModels().SessionModel.find(filter).lean()

            return sessions.map(this.map)
        }
        catch(e){
            console.log(e)
            throw new Error(JSON.stringify(e))
        }
    },
    map(session:WithId<SessionModel>):SecurityOutputModel {
        const { ip, title, lastActiveDate, _id} = session;//деструктуризация
        return { deviceId:_id.toString(), ip, lastActiveDate:lastActiveDate.toISOString(), title  }
    }
}