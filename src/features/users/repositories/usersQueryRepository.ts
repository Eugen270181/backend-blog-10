import {db} from "../../../common/module/db/db"
import {ObjectId, WithId} from "mongodb"
import {UserOutputModel} from "../types/output/userOutput.type";
import {MeOutputModel} from "../../auth/types/output/meOutput.model";
import {UsersQueryFilterType} from "../types/usersQueryFilter.type";
import {Pagination} from "../../../common/types/pagination.type";
import {User} from "../domain/user.entity";

export const usersQueryRepository = {
    async getUserById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getModels().UserModel.findOne({ _id: new ObjectId(id) });
    },
    async getMapUser(id: string) {
        const user = await this.getUserById(id)
        return user?this.mapUser(user):null
    },
    async getMapMe(id: string) {
        const user = await this.getUserById(id)
        if (!user) return {}
        return this.mapMe(user)
    },
    async getMapUsers(query:UsersQueryFilterType):Promise<Pagination<UserOutputModel[]>> {
        const searchLogin = query.searchLoginTerm ? {login:{$regex:query.searchLoginTerm,$options:'i'}}:{}
        const searchEmail = query.searchEmailTerm ? {email:{$regex:query.searchEmailTerm,$options:'i'}}:{}
        const search = {$or:[searchLogin,searchEmail]}
        try {
            const users = await db.getModels().UserModel
                .find(search)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .lean()
            const totalCount = await db.getModels().UserModel.countDocuments(search)
            return {
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize:query.pageSize,
                totalCount,
                items:users.map(this.mapUser)
            }
        }
        catch(e){
            console.log(e)
            throw new Error(JSON.stringify(e))
        }

    },
    mapUser(user:WithId<User>):UserOutputModel{
        const { _id,createdAt,login, email} = user;//деструктуризация
        return { id:_id.toString(), createdAt:user.createdAt.toISOString(), login, email }
    },
    mapMe(user:WithId<User>):MeOutputModel{
        const { _id,email, login} = user;//деструктуризация
        return { email, login, userId:_id.toString()}
    },
}
