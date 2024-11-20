import {PostDbModel} from '../types/postDb.model'
import {ObjectId} from "mongodb"
import {blogsRepository} from '../../blogs/repositories/blogsRepository'
import {CreatePostInputModel} from "../types/input/createPostInput.model";
import {UpdatePostInputModel} from "../types/input/updatePostInput.model";
import {postsRepository} from "../repository/postsRepository";


export const postsServices = {
    async createPost(post: CreatePostInputModel) {
        const {title, shortDescription, content, blogId} = post
        const newPost: PostDbModel = {
            ...{title, shortDescription, content, blogId},
            blogName: (await blogsRepository.findBlogById(post.blogId))!.name,
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
        const blog = await blogsRepository.findBlogById(post.blogId)
        if(!blog) return false
        const updateObject = {...{title, shortDescription, content, blogId},  blogName:blog.name}
        return postsRepository.updatePost(updateObject,id)
    },
}