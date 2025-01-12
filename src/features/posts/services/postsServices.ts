import {ObjectId} from "mongodb"
import {BlogsRepository} from '../../blogs/repositories/blogsRepository'
import {CreatePostInputModel} from "../types/input/createPostInput.model";
import {UpdatePostInputModel} from "../types/input/updatePostInput.model";
import {postsRepository} from "../repositories/postsRepository";
import {Post} from "../domain/post.entity";


export const postsServices = {
    async createPost(post: CreatePostInputModel) {
        const {title, shortDescription, content, blogId} = post
        const newPost: Post = {
            ...{title, shortDescription, content, blogId},
            blogName: (await BlogsRepository.findBlogById(post.blogId))!.name,
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost) // return _id -objectId
    },
    async deletePost(id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return false
        return postsRepository.deletePost(new ObjectId(id))
    },
    async updatePost(post: UpdatePostInputModel, id: string) {
        const isIdValid = ObjectId.isValid(id);
        if (!isIdValid) return false
        const {title, shortDescription, content, blogId} = post
        const blog = await BlogsRepository.findBlogById(blogId)
        if(!blog) return false
        const updateObject = {...{title, shortDescription, content, blogId},  blogName:blog.name}
        return postsRepository.updatePost(updateObject,id)
    },
}