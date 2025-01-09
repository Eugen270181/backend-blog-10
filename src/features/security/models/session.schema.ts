import mongoose from 'mongoose'
import {SessionModel} from "./session.model";



export const SessionSchema = new mongoose.Schema<SessionModel>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    userId: { type: String, required: true },
    expDate: { type: Date, required: true },
})
