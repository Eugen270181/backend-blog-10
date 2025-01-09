import {db} from "../../../common/module/db/db"
import {BlogDocument, Blog} from "../domain/blog.entity";

export class BlogsRepository {
    private BlogModel = db.getModels().BlogModel
    async save(blog: Blog):Promise<string> {
        const newBlogDocument:BlogDocument = new this.BlogModel(blog)
        const savedDocument = await newBlogDocument.save();
        return savedDocument.id
    }
    async findBlogById(id: string):Promise< BlogDocument | null > {
        return this.BlogModel.findOne({ id , deletedAt:null})
    }
}


