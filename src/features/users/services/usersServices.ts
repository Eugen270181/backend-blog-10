import {usersRepository} from "../repositories/usersRepository";
import {ObjectId} from "bson";
import {CreateUserInputModel} from "../types/input/createUserInput.type";
import {UserDbModel} from "../types/userDb.model";
import {hashServices} from "../../../common/adapters/hashServices";
import {ResultClass} from '../../../common/classes/result.class';
import {ResultStatus} from "../../../common/types/enum/resultStatus";

export const usersServices = {
    async createUser(user: CreateUserInputModel) {
        const result = new ResultClass<string>()
        const {login, password, email} = user

        if (await usersRepository.findUserByLogin(login)) {
            result.addError("not unique field!", "login")
            return result
        }
        if (await usersRepository.findUserByEmail(email)) {
            result.addError("not unique field!", "email")
            return result
        }

        const newUser: UserDbModel = {
            ...{login, email},
            passwordHash: await hashServices.getHash(password),
            createdAt: new Date(),
            emailConfirmation: {    // when admin created it's not neccessary to check email
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true
            }
        }

        const newUserId = await usersRepository.createUser(newUser)

        result.status = ResultStatus.Created;
        result.data = newUserId;
        return result
    },
    async deleteUser(id: string) {
        const isIdValid = ObjectId.isValid(id)
        if (!isIdValid) return false
        return usersRepository.deleteUser(new ObjectId(id))
    }
}