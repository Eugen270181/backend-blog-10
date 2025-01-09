import {randomUUID} from "crypto";
import {add} from "date-fns/add";

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