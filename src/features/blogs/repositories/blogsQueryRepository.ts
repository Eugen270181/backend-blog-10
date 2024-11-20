import {BlogDbModel} from '../types/blogDb.model'
import {ObjectId, WithId} from "mongodb"
import {BlogOutputModel} from "../types/output/blogOutput.model";
import {db} from "../../../common/module/db/db";
import {Pagination} from "../../../common/types/pagination.type";
import {BlogsQueryFilterType} from "../types/blogsQueryFilter.type";


export const blogsQueryRepository = {

    async findBlogById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getCollections().blogsCollection.findOne({ _id: new ObjectId(id) });
    },
    async findBlogAndMap(id: string) {
        const blog = await this.findBlogById(id)
        return blog?this.map(blog):null
    },
    async getBlogsAndMap(query:BlogsQueryFilterType):Promise<Pagination<BlogOutputModel[]>> {
        const search = query.searchNameTerm ? {name:{$regex:query.searchNameTerm,$options:'i'}}:{}
        try {
            const blogs = await db.getCollections().blogsCollection
                .find(search)
                .sort(query.sortBy,query.sortDirection)
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .toArray()
            const totalCount = await db.getCollections().blogsCollection.countDocuments(search)
            return {
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize:query.pageSize,
                totalCount,
                items:blogs.map(this.map)
            }
        }
        catch(e){
            console.log(e)
            throw new Error(JSON.stringify(e))
        }

    },
    map(blog:WithId<BlogDbModel>):BlogOutputModel{
        const { _id, ...blogForOutput } = blog;//деструктуризация
        return {id:blog._id.toString(),...blogForOutput}
    },
}
