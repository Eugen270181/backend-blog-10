import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {CommentDbModel} from "../types/commentDb.model";
import {UpdateCommentInputModel} from "../types/input/updateCommentInput.model";

export const commentsRepository = {
    async createComment(comment:CommentDbModel):Promise<string> {
        const result = await db.getCollections().commentsCollection.insertOne(comment)
        return result.insertedId.toString() // return _id -objectId
    },
    async findCommentById(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return null
        return db.getCollections().commentsCollection.findOne({ _id: new ObjectId(id) });
    },
    async deleteComment(id:ObjectId){
        const result = await db.getCollections().commentsCollection.deleteOne({ _id: id });
        return result.deletedCount > 0
    },
    async updateComment(comment:UpdateCommentInputModel, id:string) {
        const filter = { _id: new ObjectId(id) }
        const updater = { $set: { ...comment } }
        const result = await db.getCollections().commentsCollection.updateOne(filter, updater)
        return result.modifiedCount > 0
    },
}