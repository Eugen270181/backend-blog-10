import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UserModel} from "../models/user.model";

export const usersRepository = {
    async createUser(user: UserModel):Promise<string> {
        const result = await db.getModels().UserModel.create(user)
        return result.id // return _id -objectId
    },
    async getUserById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getModels().UserModel.findOne({ _id: new ObjectId(id) });
    },
    async findByLoginOrEmail(inputLogin:string){
        const search = { $or: [
            { login: inputLogin },  // поля логина
            { email: inputLogin }      // или электронная почта
        ] }
        return db.getModels().UserModel.findOne(search);
    },
    async findUserByLogin(login: string) {
        return db.getModels().UserModel.findOne({login})
    },
    async findUserByEmail(email: string) {
        return db.getModels().UserModel.findOne({email} )
    },
    async findUserByRegConfirmCode(code: string) {
        return db.getModels().UserModel.findOne({'emailConfirmation.confirmationCode':code} )
    },
    async findUserByPassConfirmCode(code: string) {
        return db.getModels().UserModel.findOne({'passConfirmation.confirmationCode':code} )
    },
    async activateConfirmation(_id:ObjectId) {
        const result = await db.getModels().UserModel
            .updateOne({_id},{$set:{'emailConfirmation.isConfirmed':true}})
        return result.modifiedCount === 1
    },
    async updatePassHash(_id:ObjectId, passwordHash: string) {
        const result = await db.getModels().UserModel
            .updateOne({_id},{$set:{passwordHash}})
        return result.modifiedCount === 1
    },
    async setRegConfirmationCode(_id:ObjectId, code:string, date:Date) {
        const result = await db.getModels().UserModel
          .updateOne({_id},{$set:{'emailConfirmation.confirmationCode':code,'emailConfirmation.expirationDate':date}})
        return result.modifiedCount === 1
    },
    async setPassConfirmationCode(_id:ObjectId, code:string, date:Date) {
        const result = await db.getModels().UserModel
            .updateOne({_id},{$set:{'passConfirmation.confirmationCode':code,'passConfirmation.expirationDate':date}})
        return result.modifiedCount === 1
    },
    async deleteUser(id:ObjectId){
        const result = await db.getModels().UserModel.deleteOne({ _id: id });
        return result.deletedCount > 0
    },
}