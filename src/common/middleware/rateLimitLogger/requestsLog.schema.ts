import mongoose from 'mongoose'
import {RequestsLogModel} from "./requestsLog.model";

export const RequestsLogSchema = new mongoose.Schema<RequestsLogModel>({
    ip: { type: String, require: true },
    url: { type: String, require: true },
    date: { type: Date, require: true },
})