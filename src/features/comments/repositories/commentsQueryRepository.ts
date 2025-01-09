import {db} from "../../../common/module/db/db"
import {ObjectId, WithId} from "mongodb"
import {SortQueryFilterType} from "../../../common/types/sortQueryFilter.type";
import {CommentOutputModel} from "../types/output/commentOutput.model";
import {pagCommentOutputModel} from "../types/output/pagCommentOutput.model";
import {CommentDocument, CommentModel} from "../models/comment.model";

export const commentsQueryRepository = {
    async findCommentById(id: string):Promise< CommentDocument | null > {
        const CommentsModel = db.getModels().CommentModel
        return CommentsModel.findOne({ _id: id });
    },
    async findCommentAndMap(id: string):Promise< CommentOutputModel | null > {
        const comment = await this.findCommentById(id)
        return comment?this.map(comment):null
    },
    async getCommentsAndMap(query:SortQueryFilterType, postId?:string):Promise<pagCommentOutputModel> {
        const search = postId?{postId:postId}:{}
        try {
            const CommentsModel = db.getModels().CommentModel
            const comments = await CommentsModel
                .find(search)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .exec()
            const totalCount = await CommentsModel.countDocuments(search)
            return {
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize:query.pageSize,
                totalCount,
                items:comments.map(this.map)
            }
        }
        catch(e){
            console.log(e)
            throw new Error(JSON.stringify(e))
        }

    },
    map(comment:WithId<CommentModel>):CommentOutputModel{
        const { _id, postId,...commentForOutPut} = comment;//деструктуризация
        return {id:comment._id.toString(),...commentForOutPut}
    },
}
