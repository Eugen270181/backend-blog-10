import {db} from "../../../common/module/db/db"
import {ObjectId} from "mongodb"
import {UpdateCommentInputModel} from "../types/input/updateCommentInput.model";
import {CommentDocument, CommentModel} from "../models/comment.model";

export const commentsRepository = {
    async createComment(comment:CommentModel):Promise<string> {
        const CommentsModel = db.getModels().CommentModel
        const newCommentToDB = new CommentsModel(comment)
        await newCommentToDB.save()
        return newCommentToDB._id.toString()
    },
    async findCommentById(id: string):Promise< CommentDocument | null > {
        const CommentsModel = db.getModels().CommentModel
        return CommentsModel.findOne({ _id: id });
    },
    async deleteComment(id:ObjectId):Promise<Boolean> {
        const CommentsModel = db.getModels().CommentModel
        const result = await CommentsModel.deleteOne({ _id: id });
        return result.deletedCount > 0
    },
    async updateComment(comment:UpdateCommentInputModel, id:string):Promise<Boolean> {
        const CommentsModel = db.getModels().CommentModel
        const filter = { _id: id }
        const updater = { $set: { ...comment } }
        const result = await CommentsModel.updateOne(filter, updater)
        return result.modifiedCount > 0
    },
}