import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UpdatePostInputModel} from "../types/input/updatePostInput.model";
import {Post} from "../domain/post.entity";

export const postsRepository = {
    async createPost(post: Post) {
        const result = await db.getModels().PostModel.create(post)
        return result.id // return _id -objectId
    },
    async findPostById(id: string) {
        const isIdValid = ObjectId.isValid(id)
        if (!isIdValid) return null
        return db.getModels().PostModel.findOne({ _id: new ObjectId(id) })
    },
    async deletePost(id: ObjectId) {
        const result = await db.getModels().PostModel.deleteOne({ _id: id })
        return result.deletedCount > 0
    },
    async updatePost(post: UpdatePostInputModel&{blogName:string}, id: string) {
        const filter = { _id: new ObjectId(id) }
        const updater = { $set: { ...post }}
        const result = await db.getModels().PostModel.updateOne( filter, updater );
        return result.modifiedCount > 0;
    },
}