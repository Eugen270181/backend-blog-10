import {db} from "../../../common/module/db/DB"
import {BlogDocument} from "../domain/blog.entity";

export class BlogsRepository {
    private blogModel = db.getModels().BlogModel

    async save(blogDocument: BlogDocument):Promise<void> {
        await blogDocument.save();
    }
    async findBlogById(id: string):Promise< BlogDocument | null > {
        return this.blogModel.findOne({ _id: id , deletedAt: null }).catch(()=> null )
    }
}


