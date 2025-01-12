import {HydratedDocument, Model, Schema} from "mongoose";

export type SessionModel = Model<Session>

export type SessionDocument = HydratedDocument<Session>;

export type Session = {
    ip: string
    title: string
    lastActiveDate: Date
    userId:string
    expDate: Date
}

export const sessionSchema:Schema<Session> = new Schema<Session>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    userId: { type: String, required: true },
    expDate: { type: Date, required: true },
})