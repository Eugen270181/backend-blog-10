import mongoose from 'mongoose'
import {UserModel} from "./user.model";
import {EmailConfirmationModel, PassConfirmationModel} from "../classes/user.class";

const EmailConfirmationSchema= new mongoose.Schema<EmailConfirmationModel> ({
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true },
})
const PassConfirmationSchema= new mongoose.Schema<PassConfirmationModel>({
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
})

export const UserSchema = new mongoose.Schema<UserModel>({
    login: { type: String, require: true },
    email: { type: String, require: true },
    passwordHash: { type: String, require: true },
    createdAt: { type: Date, require: true },
    emailConfirmation: { type: EmailConfirmationSchema },
    passConfirmation: { type: PassConfirmationSchema },
})
