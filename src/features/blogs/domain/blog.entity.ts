import {Model, HydratedDocument, Schema} from 'mongoose';


export type BlogModel = Model<Blog>

export type BlogDocument = HydratedDocument<Blog>

export class Blog {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    deletedAt: Date | null
    isMembership: boolean

    constructor(name: string, description: string, websiteUrl: string) {
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.createdAt = new Date()
        this.deletedAt = null
        this.isMembership = false
    }

    delete(){
        this.deletedAt = new Date()
    }
    update(name?:string, description?:string, websiteUrl?:string) {
        this.name = name??this.name
        this.description = description??this.description
        this.websiteUrl = websiteUrl??this.websiteUrl
    }

}

export const blogSchema:Schema<Blog> = new Schema<Blog>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
    deletedAt: { type: Date, required: true, default: null },
    isMembership: { type: Boolean, required: true },
})



