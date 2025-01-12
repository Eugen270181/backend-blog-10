import mongoose, {model} from "mongoose";

import { appConfig } from "../../settings/config";
import {Blog, BlogModel, blogSchema} from "../../../features/blogs/domain/blog.entity";
import {Post, PostModel, postSchema} from "../../../features/posts/domain/post.entity";
import {RequestsLog, RequestsLogModel, requestsLogSchema} from "../../middleware/rateLimitLogger/requestsLog.entity";
import {Session, sessionSchema} from "../../../features/security/domain/session.entity";
import {User, UserModel, userSchema} from "../../../features/users/domain/user.entity";
import {Comment, CommentModel, commentSchema} from "../../../features/comments/domain/comment.entity";



export const db = {
    client: {} as mongoose.Connection,
    // Метод для получения имени базы данных
    getDbName() {
        return this.client.name || 'No database connected';
    },
    // Метод для подключения к базе данных
    async run(url: string) {
        try {
            await mongoose.connect(url);
            this.client = mongoose.connection; // Сохраняем ссылку на подключение
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.stop();
        }
    },

    // Метод для отключения от базы данных
    async stop() {
        await mongoose.disconnect();
        console.log("Connection successfully closed");
    },

    // Метод для очистки базы данных
    async drop() {
        try {
            const collections = Object.keys(mongoose.connection.collections);
            for (const collectionName of collections) {
                await mongoose.connection.collections[collectionName].deleteMany({});
            }
            console.log("All collections are cleared");
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },

    // Метод для получения моделей коллекций
    getModels() {
        return {
            UserModel: model<User, UserModel>(appConfig.USERS_COLLECTION_NAME, userSchema),
            BlogModel: model<Blog, BlogModel>(appConfig.BLOGS_COLLECTION_NAME, blogSchema),
            PostModel: model<Post, PostModel>(appConfig.POSTS_COLLECTION_NAME, postSchema),
            CommentModel: model<Comment, CommentModel>(appConfig.COMMENTS_COLLECTION_NAME, commentSchema),
            RequestsLogModel: model<RequestsLog, RequestsLogModel>(appConfig.REQUESTS_COLLECTION_NAME, requestsLogSchema),
            SessionModel: model<Session>(appConfig.SESSIONS_COLLECTION_NAME, sessionSchema),
            //...all collections
        };
    },
};
