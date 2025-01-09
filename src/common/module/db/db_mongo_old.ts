import mongoose from "mongoose";
import {Db, MongoClient} from "mongodb"
import {appConfig} from "../../settings/config";
import {RequestsLogModel} from "../../middleware/rateLimitLogger/requestsLog.model";
import {PostModel} from "../../../features/posts/models/post.model";
import {UserModel} from "../../../features/users/models/user.model";
import {Blog} from "../../../features/blogs/domain/blog.entity";
import {CommentModel} from "../../../features/comments/models/comment.model";
import {SessionModel} from "../../../features/security/models/session.model";

export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db(appConfig.DB_NAME);
    },
    async run(url: string) {
        try {
            this.client = new MongoClient(url)
            await this.client.connect();
            await this.getDbName().command({ping: 1});
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.stop();
        }
    },
    async stop() {
        await this.client.close();
        console.log("Connection successful closed");
    },
    async drop() {
        try {
            //await this.getDbName().dropDatabase()
            const collections = await this.getDbName().listCollections().toArray();

            for (const collection of collections) {
                const collectionName = collection.name;

                //await this.getDbName().collection(collectionName).drop();
                await this.getDbName().collection(collectionName).deleteMany({});
            }
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },
    getCollections() {
        return {
            UserModel: this.getDbName().collection<UserModel>(appConfig.USERS_COLLECTION_NAME),
            BlogModel: this.getDbName().collection<Blog>(appConfig.BLOGS_COLLECTION_NAME),
            PostModel: this.getDbName().collection<PostModel>(appConfig.POSTS_COLLECTION_NAME),
            CommentModel: this.getDbName().collection<CommentModel>(appConfig.COMMENTS_COLLECTION_NAME),
            requestsLogCollection: this.getDbName().collection<RequestsLogModel>(appConfig.REQUESTS_COLLECTION_NAME),
            SessionModel: this.getDbName().collection<SessionModel>(appConfig.SESSIONS_COLLECTION_NAME),
            //...all collections
        }
    },

}