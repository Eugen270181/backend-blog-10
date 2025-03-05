import {db} from "../../../common/module/db/DB"
import {PostDocument} from "../domain/post.entity";


export class PostsRepository {
    private postModel = db.getModels().PostModel
    async save(post: PostDocument): Promise<void> {
        await post.save()
    }
    async findPostById(id: string):Promise< PostDocument | null > {
        return this.postModel.findOne({ _id: id , deletedAt:null}).catch(()=> null )
    }
}