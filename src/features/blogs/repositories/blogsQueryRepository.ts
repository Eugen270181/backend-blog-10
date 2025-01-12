import {ObjectId, WithId} from "mongodb"
import {BlogOutputModel} from "../types/output/blogOutput.model";
import {db} from "../../../common/module/db/db";
import {Pagination} from "../../../common/types/pagination.type";
import {BlogsQueryFilterType} from "../types/blogsQueryFilter.type";
import {BlogDocument, Blog} from "../domain/blog.entity";


export class BlogsQueryRepository {
    private BlogModel = db.getModels().BlogModel
    async findBlogById(id: string):Promise< WithId<Blog> | null > {
        return this.BlogModel.findOne({ id , deletedAt:null}).lean();
    }
    async findBlogAndMap(id: string) {
        const blog = await this.findBlogById(id)
        return blog?this.map(blog):null
    }
    async getBlogsAndMap(query:BlogsQueryFilterType):Promise<Pagination<BlogOutputModel[]>> {
        const search = query.searchNameTerm ? {name:{$regex:query.searchNameTerm,$options:'i'}}:{}
        try {
            const blogs = await this.BlogModel
                .find(search)
                .sort({ [query.sortBy]: query.sortDirection }) // объект для сортировки
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const totalCount = await this.BlogModel.countDocuments(search)
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
    }
    map(blog:WithId<Blog>):BlogOutputModel{
        //const { _id, createdAt, deletedAt } = blog;//деструктуризация
       // return {id:blog._id.toString(),createdAt:createdAt.toISOString(),...blogForOutput}
        return {
            id:blog._id.toString(),
            name:blog.name,
            description:blog.description,
            websiteUrl:blog.websiteUrl,
            createdAt:blog.createdAt.toISOString(),
            isMembership:blog.isMembership,
        }
    }
}
