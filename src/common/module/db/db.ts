import mongoose, {model} from "mongoose";

import { appConfig } from "../../settings/config";
import {Blog, BlogModel, blogSchema} from "../../../features/blogs/domain/blog.entity";
import {UserSchema} from "../../../features/users/models/user.schema";
import {PostSchema} from "../../../features/posts/models/post.schema";
import {CommentSchema} from "../../../features/comments/models/comment.schema";
import {SessionSchema} from "../../../features/security/models/session.schema";
import {RequestsLogModel} from "../../middleware/rateLimitLogger/requestsLog.model";
import {SessionModel} from "../../../features/security/models/session.model";
import {UserModel} from "../../../features/users/models/user.model";
import {PostModel} from "../../../features/posts/models/post.model";
import {CommentModel} from "../../../features/comments/models/comment.model";
import {RequestsLogSchema} from "../../middleware/rateLimitLogger/requestsLog.schema";


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
            console.log("All collections cleared");
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },

    // Метод для получения моделей коллекций
    getModels() {
        return {
            UserModel: model<UserModel>(appConfig.USERS_COLLECTION_NAME, UserSchema),
            BlogModel: model<Blog, BlogModel>(appConfig.BLOGS_COLLECTION_NAME, blogSchema),
            PostModel: mongoose.model<PostModel>(appConfig.POSTS_COLLECTION_NAME, PostSchema),
            CommentModel: mongoose.model<CommentModel>(appConfig.COMMENTS_COLLECTION_NAME, CommentSchema),
            RequestsLogModel: mongoose.model<RequestsLogModel>(appConfig.REQUESTS_COLLECTION_NAME, RequestsLogSchema),
            SessionModel: mongoose.model<SessionModel>(appConfig.SESSIONS_COLLECTION_NAME, SessionSchema),
            //...all collections
        };
    },
};
