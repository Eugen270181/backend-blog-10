import {PostDbModel} from '../types/postDb.model'
import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UpdatePostInputModel} from "../types/input/updatePostInput.model";

export const postsRepository = {
    async createPost(post: PostDbModel) {
        const result = await db.getCollections().postsCollection.insertOne(post)
        return result.insertedId.toString() // return _id -objectId
    },
    async findPostById(id: string) {
        const isIdValid = ObjectId.isValid(id)
        if (!isIdValid) return null
        return db.getCollections().postsCollection.findOne({ _id: new ObjectId(id) })
    },
    async deletePost(id: ObjectId) {
        const result = await db.getCollections().postsCollection.deleteOne({ _id: id })
        return result.deletedCount > 0
    },
    async updatePost(post: UpdatePostInputModel&{blogName:string}, id: string) {
        const filter = { _id: new ObjectId(id) }
        const updater = { $set: { ...post }}
        const result = await db.getCollections().postsCollection.updateOne( filter, updater );
        return result.modifiedCount > 0;
    },
}