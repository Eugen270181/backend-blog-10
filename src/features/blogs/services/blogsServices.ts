import {BlogsRepository} from "../repositories/blogsRepository";
import {CreateBlogInputModel} from "../types/input/createBlogInput.model";
import {UpdateBlogInputModel} from "../types/input/updateblogInput.model";
import {BlogDocument, Blog} from "../domain/blog.entity";


export class BlogsServices {
    private blogsRepository: BlogsRepository
    constructor() {
        this.blogsRepository = new BlogsRepository()
     }
    async createBlog(blog: CreateBlogInputModel):Promise<string> {
        const {name, description, websiteUrl} = blog

        const newBlog:Blog = new Blog(name, description, websiteUrl)

        return this.blogsRepository.save(newBlog)
    }
    async deleteBlog(id:string){
        const foundBlogDocument: BlogDocument | null = await this.blogsRepository.findBlogById(id);
        if (!foundBlogDocument) return false;

        foundBlogDocument.delete();

        await this.blogsRepository.save(foundBlogDocument);
        return true;
    }
    async updateBlog(blog: UpdateBlogInputModel, id: string) {
        const foundBlogDocument: BlogDocument | null = await this.blogsRepository.findBlogById(id);
        if (!foundBlogDocument) return false;

        const {name, description, websiteUrl} = blog
        foundBlogDocument.update(name, description, websiteUrl)

        await this.blogsRepository.save(foundBlogDocument);
        return true;
    }
}