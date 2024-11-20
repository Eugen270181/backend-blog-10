import {blogsRepository} from "../repositories/blogsRepository";
import {CreateBlogInputModel} from "../types/input/createBlogInput.model";
import {UpdateBlogInputModel} from "../types/input/updateblogInput.model";
import {BlogDbModel} from "../types/blogDb.model";
import {ObjectId} from "bson";

export const blogsServices = {
    async createBlog(blog: CreateBlogInputModel):Promise<string> {
        const {name, description, websiteUrl} = blog
        const newBlog:BlogDbModel = {
            ...{name, description, websiteUrl},
            createdAt: new Date().toISOString(),
            isMembership:false
        }
        return blogsRepository.createBlog(newBlog)
    },
    async deleteBlog(id:string){
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return false
        return blogsRepository.deleteBlog(new ObjectId(id))
    },
    async updateBlog(blog: UpdateBlogInputModel, id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return false
        return blogsRepository.updateBlog(blog,id)
    },
}