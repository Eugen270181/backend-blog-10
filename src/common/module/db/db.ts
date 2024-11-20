import {Db, MongoClient} from "mongodb"
import {BlogDbModel} from '../../../features/blogs/types/blogDb.model'
import {PostDbModel} from '../../../features/posts/types/postDb.model'
import {appConfig} from "../../settings/config";
import {UserDbModel} from "../../../features/users/types/userDb.model";
import {CommentDbModel} from "../../../features/comments/types/commentDb.model";
import {SecurityDbModel} from "../../../features/security/types/securityDb.model";
import {RequestsLogDbModel} from "../../middleware/rateLimitLogger/requestsLogDb.model";

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
            usersCollection: this.getDbName().collection<UserDbModel>(appConfig.USERS_COLLECTION_NAME),
            blogsCollection: this.getDbName().collection<BlogDbModel>(appConfig.BLOGS_COLLECTION_NAME),
            postsCollection: this.getDbName().collection<PostDbModel>(appConfig.POSTS_COLLECTION_NAME),
            commentsCollection: this.getDbName().collection<CommentDbModel>(appConfig.COMMENTS_COLLECTION_NAME),
            requestsLogCollection: this.getDbName().collection<RequestsLogDbModel>(appConfig.REQUESTS_COLLECTION_NAME),
            sessionsCollection: this.getDbName().collection<SecurityDbModel>(appConfig.SESSIONS_COLLECTION_NAME),
            //...all collections
        }
    },

}