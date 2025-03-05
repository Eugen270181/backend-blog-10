import {LikeDocument} from "../domain/like.entity";
import {db} from "../../../common/module/db/DB";


export class LikesRepository {
    private likeModel = db.getModels().LikeModel

    async save(likeDocument: LikeDocument):Promise<void> {
        await likeDocument.save();
    }
    async findLikeByAuthorIdAndParentId(authorId: string, parentId:string):Promise< LikeDocument | null > {

        return this.likeModel.findOne({ authorId , parentId })
    }
}