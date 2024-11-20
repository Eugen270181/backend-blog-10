export type commentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentDbModel = {
    content: string
    commentatorInfo: commentatorInfo
    createdAt: string
    postId:string
}