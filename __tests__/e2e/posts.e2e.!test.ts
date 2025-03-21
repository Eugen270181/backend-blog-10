import {req} from './helpers/test-helpers'
import {dbMongo, setDB} from '../src/db/dbMemory'
import {appConfig} from '../src/common/settings/config'
import {codedAuth, createString, dataset1, dataset2} from './helpers/datasets'

import {CreatePostInputModel} from "../src/features/posts/types/input/createPostInput.model";

describe('/posts', () => {
    // beforeAll(async () => { // очистка базы данных перед началом тестирования
    //     setDB()
    // })

    it('should create', async () => {
        setDB(dataset1)
        const newPost: CreatePostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .post(appConfig.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(201)

        // console.log(res.body)

        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(dataset1.blogs[0].name)
        expect(typeof res.body.id).toEqual('string')

        expect(res.body).toEqual(dbMongo.posts[0])
    })
    it('shouldn\'t create 401', async () => {
        setDB(dataset1)
        const newPost: CreatePostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .post(appConfig.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

        // console.log(res.body)

        expect(dbMongo.posts.length).toEqual(0)
    })
    it('shouldn\'t create', async () => {
        setDB()
        const newPost: CreatePostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .post(appConfig.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(400)

        // console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        expect(dbMongo.posts.length).toEqual(0)
    })
    it('should get empty array', async () => {
        setDB() // очистка базы данных если нужно

        const res = await req
            .get(appConfig.PATH.POSTS)
            .expect(200) // проверяем наличие эндпоинта

        // console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toEqual(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        setDB(dataset2) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(appConfig.PATH.POSTS)
            .expect(200)

        // console.log(res.body)

        expect(res.body.length).toEqual(1)
        expect(res.body[0]).toEqual(dataset2.posts[0])
    })
    it('shouldn\'t find', async () => {
        setDB(dataset1)

        const res = await req
            .get(appConfig.PATH.POSTS + '/1')
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('should find', async () => {
        setDB(dataset2)

        const res = await req
            .get(appConfig.PATH.POSTS + '/' + dataset2.posts[0].id)
            .expect(200) // проверка на ошибку

        // console.log(res.body)

        expect(res.body).toEqual(dataset2.posts[0])
    })
    it('should del', async () => {
        setDB(dataset2)

        const res = await req
            .delete(appConfig.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204) // проверка на ошибку

        // console.log(res.body)

        expect(dbMongo.posts.length).toEqual(0)
    })
    it('shouldn\'t del', async () => {
        setDB()

        const res = await req
            .delete(appConfig.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t del 401', async () => {
        setDB()

        const res = await req
            .delete(appConfig.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic' + codedAuth}) // no ' '
            .expect(401) // проверка на ошибку

        // console.log(res.body)
    })
    it('should update', async () => {
        setDB(dataset2)
        const post: CreatePostInputModel = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            blogId: dataset2.blogs[1].id,
        }

        const res = await req
            .put(appConfig.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(204) // проверка на ошибку

        // console.log(res.body)

        expect(dbMongo.posts[0]).toEqual({...dbMongo.posts[0], ...post, blogName: dataset2.blogs[1].name})
    })
    it('shouldn\'t update 404', async () => {
        setDB()
        const post: CreatePostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .put(appConfig.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t update2', async () => {
        setDB(dataset2)
        const post: CreatePostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(appConfig.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(400) // проверка на ошибку

        // console.log(res.body)

        expect(dbMongo).toEqual(dataset2)
        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')
    })
    it('shouldn\'t update 401', async () => {
        setDB(dataset2)
        const post: CreatePostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(appConfig.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(post)
            .expect(401) // проверка на ошибку

        // console.log(res.body)

        expect(dbMongo).toEqual(dataset2)
    })
})