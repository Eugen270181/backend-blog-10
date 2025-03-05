import {db} from "../../../common/module/db/DB"
import {CommentDocument} from "../domain/comment.entity";


export class CommentsRepository {
    private commentModel = db.getModels().CommentModel

    async save(commentDocument: CommentDocument):Promise<void> {
        await commentDocument.save()
    }
    async findCommentById(_id: string):Promise< CommentDocument | null > {
        return this.commentModel.findOne({ _id , deletedAt:null}).catch(()=> null )
    }
    async increaseLikeCounter(_id: string){
        await this.commentModel.updateOne( { _id , deletedAt:null}, { $inc: { likeCount: 1 } } )
    }
    async decreaseLikeCounter(_id: string){
        await this.commentModel.updateOne( { _id , deletedAt:null}, { $inc: { likeCount: -1 } } )
    }
    async increaseDislikeCounter(_id: string){
        await this.commentModel.updateOne( { _id , deletedAt:null}, { $inc: { dislikeCount: 1 } } )
    }
    async decreaseDislikeCounter(_id: string){
        await this.commentModel.updateOne( { _id , deletedAt:null}, { $inc: { dislikeCount: -1 } } )
    }

}