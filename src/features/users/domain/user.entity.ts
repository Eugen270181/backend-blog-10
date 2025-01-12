import {add} from "date-fns/add";
import {randomUUID} from "crypto";
import {HydratedDocument, Model, Schema} from "mongoose";

export type UserModel = Model<User>

export type UserDocument = HydratedDocument<User>;

export type EmailConfirmationModel = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export type PassConfirmationModel = {
    confirmationCode: string;
    expirationDate: Date;
}
export class User {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
    emailConfirmation: EmailConfirmationModel
    passConfirmation: PassConfirmationModel

    constructor(login: string, email: string, hash: string) {
        this.login = login
        this.email = email
        this.passwordHash = hash
        this.createdAt = new Date()
        this.emailConfirmation = {
            expirationDate: add( new Date(), { hours: 1, minutes: 30 } ),
            confirmationCode: randomUUID(),
            isConfirmed: false
        }
        this.passConfirmation = {
            confirmationCode: '',
            expirationDate: new Date()
        }
    }
}

const emailConfirmationSchema:Schema<EmailConfirmationModel> = new Schema<EmailConfirmationModel> ({
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true },
})
const passConfirmationSchema:Schema<PassConfirmationModel>= new Schema<PassConfirmationModel>({
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
})
export const userSchema:Schema<User> = new Schema<User>({
    login: { type: String, require: true },
    email: { type: String, require: true },
    passwordHash: { type: String, require: true },
    createdAt: { type: Date, require: true },
    emailConfirmation: { type: emailConfirmationSchema },
    passConfirmation: { type: passConfirmationSchema },
})