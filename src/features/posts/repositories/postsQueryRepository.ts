import {db} from "../../../common/module/db/db"
import {ObjectId, WithId} from "mongodb"
import {PostOutputModel} from "../types/output/postOutput.model";
import {SortQueryFilterType} from "../../../common/types/sortQueryFilter.type";
import {pagPostOutputModel} from "../types/output/pagPostOutput.model";
import {Post} from "../domain/post.entity";

export const postsQueryRepository = {
    async findPostById(id: string) {
        const isIdValid = ObjectId.isValid(id)
        if (!isIdValid) return null
        return db.getModels().PostModel.findOne({ _id: new ObjectId(id) })
    },
    async findPostAndMap(id: string) {
        const post = await this.findPostById(id)
        return post?this.map(post):null
    },
    async getPostsAndMap(query:SortQueryFilterType, blogId?:string):Promise<pagPostOutputModel> { // используем этот метод если проверили валидность и существование в бд значения blogid
        const filter = blogId?{blogId}:{}
        //const search = query.searchNameTerm ? {title:{$regex:query.searchNameTerm,$options:'i'}}:{}
        try {
            const posts = await db.getModels().PostModel
                .find(filter)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .lean()
            const totalCount = await db.getModels().PostModel.countDocuments(filter)
            return {
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize:query.pageSize,
                totalCount,
                items:posts.map(this.map)
            }
        }
        catch(e){
            console.log(e)
            throw new Error(JSON.stringify(e))
        }

    },
    map(post:WithId<Post>):PostOutputModel{
        const { _id, ...postForOutput } = post;//деструктуризация
        return {id:post._id.toString(),...postForOutput}
    },
}