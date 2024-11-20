import {BlogDbModel} from '../types/blogDb.model'
import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UpdateBlogInputModel} from "../types/input/updateblogInput.model";

export const blogsRepository = {
    async createBlog(blog: BlogDbModel):Promise<string> {
        const result = await db.getCollections().blogsCollection.insertOne(blog)
        return result.insertedId.toString() // return _id -objectId
    },
    async findBlogById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getCollections().blogsCollection.findOne({ _id: new ObjectId(id) });
    },
    async deleteBlog(id:ObjectId){
        const result = await db.getCollections().blogsCollection.deleteOne({ _id: id });
        return result.deletedCount > 0
    },
    async updateBlog(blog:UpdateBlogInputModel, id:string) {
        const {name, description, websiteUrl} = blog
        const filter = { _id: new ObjectId(id) }
        const updater = { $set: { ...{name, description, websiteUrl} } }
        const result = await db.getCollections().blogsCollection.updateOne(filter, updater)
        return result.modifiedCount > 0
    },
}