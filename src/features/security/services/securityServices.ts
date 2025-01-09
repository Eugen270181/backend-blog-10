import {ObjectId} from "bson";

import {securityRepository} from "../repositories/securityRepository";
import {WithId} from "mongodb";
import {SessionModel} from "../models/session.model";

export const securityServices = {
    async createSession(sessionObject:WithId<SessionModel>) {
        return securityRepository.createSession(sessionObject)
    },
    async deleteSession(_id:ObjectId){
        const isIdValid = ObjectId.isValid(_id);
        if (!isIdValid) return false
        return securityRepository.deleteSession(_id)
    },
    async deleteOtherSessions(userId:string, _id:ObjectId){
        const isIdValid = ObjectId.isValid(_id);
        if (!isIdValid) return false
        return securityRepository.deleteOtherSessions(userId, _id)
    },
    async updateSession(lastActiveDate: Date, expDate: Date, _id: object) {
        return securityRepository.updateSession(lastActiveDate, expDate, _id)
    },
}