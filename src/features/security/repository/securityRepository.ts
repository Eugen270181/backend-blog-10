import {db} from "../../../common/module/db/db"
import {ObjectId, WithId} from "mongodb"
import {SessionFindType} from "../../../common/types/sessionFind.type";
import {SecurityDbModel} from "../types/securityDb.model";


export const securityRepository = {
    async findSessionById(deviceId:string) {
        const isIdValid = ObjectId.isValid(deviceId);
        if (!isIdValid) return null
        const _id=new ObjectId(deviceId)
        return db.getCollections().sessionsCollection.findOne({ _id });
    },
    async findActiveSession(sessionFilter:SessionFindType) {
        const { userId, deviceId, lastActiveDate } = sessionFilter
        const isIdValid = ObjectId.isValid(deviceId);
        if (!isIdValid) return null
        const _id=new ObjectId(deviceId)
        return db.getCollections().sessionsCollection.findOne({ userId, _id, lastActiveDate });
    },
    async createSession(sessionObject:WithId<SecurityDbModel>) {
        const result = await db.getCollections().sessionsCollection.insertOne(sessionObject)
        return result.insertedId.toString()
    },
    async updateSession(lastActiveDate:Date, expDate:Date, _id: object) {
        const filter = { _id }
        const updater = { $set: { lastActiveDate, expDate } }
        const result = await db.getCollections().sessionsCollection.updateOne( filter, updater );
        return result.modifiedCount > 0;
    },
    async deleteSession(_id:ObjectId){
        const result = await db.getCollections().sessionsCollection.deleteOne({ _id });
        return result.deletedCount > 0
    },
    async deleteOtherSessions(userId:string, _id:ObjectId){
        const filter ={ userId,  _id: { $ne: _id } }
        const result = await db.getCollections().sessionsCollection.deleteMany(filter);
        return result.deletedCount > 0
    },


}