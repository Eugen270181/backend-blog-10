import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UserDbModel} from "../types/userDb.model";

export const usersRepository = {
    async createUser(user: UserDbModel):Promise<string> {
        const result = await db.getCollections().usersCollection.insertOne(user)
        return result.insertedId.toString() // return _id -objectId
    },
    async getUserById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getCollections().usersCollection.findOne({ _id: new ObjectId(id) });
    },
    async findByLoginOrEmail(inputLogin:string){
        const search = { $or: [
            { login: inputLogin },  // поля логина
            { email: inputLogin }      // или электронная почта
        ] }
        return db.getCollections().usersCollection.findOne(search);
    },
    async findUserByLogin(login: string) {
        return db.getCollections().usersCollection.findOne({login})
    },
    async findUserByEmail(email: string) {
        return db.getCollections().usersCollection.findOne({email} )
    },
    async findUserByRegConfirmCode(code: string) {
        return db.getCollections().usersCollection.findOne({'emailConfirmation.confirmationCode':code} )
    },
    async updateConfirmation(_id:ObjectId) {
        const result = await db.getCollections().usersCollection
            .updateOne({_id},{$set:{'emailConfirmation.isConfirmed':true}})
        return result.modifiedCount === 1
    },
    async setConfirmationCode(_id:ObjectId,code:string,date:Date) {
        const result = await db.getCollections().usersCollection
          .updateOne({_id},{$set:{'emailConfirmation.confirmationCode':code,'emailConfirmation.expirationDate':date}})
        return result.modifiedCount === 1
    },
    async deleteUser(id:ObjectId){
        const result = await db.getCollections().usersCollection.deleteOne({ _id: id });
        return result.deletedCount > 0
    },
}