const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const loginDetails = {
    // eslint-disable-next-line quotes
    "username": "Julius",
    // eslint-disable-next-line quotes
    "password": "mypassword"
}

describe('information about blogs in db', () => {
    test('correct number of blogs are returned and in json', async () => {
        const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(response.body.length)
    })

    test('unique blog identifier is id', async () => {
        await api.get('/api/blogs')
        expect('id').toBeDefined()
    })
})

describe('posting blogs', () => {
    test('a valid blog can be added', async () => {
        const blogsBeforePost = await helper.blogsInDb()

        const login = await api
            .post('/api/login')
            .send(loginDetails)

        const testBlog = {
            title: 'Android 11 latest beta is all about stability',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/8/21317085/android-11-beta-2-platform-stability-apis-developer-update-google-pixel',
            likes: 2
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${login.body.token}` })
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()
        expect(blogsAfterPost).toHaveLength(blogsBeforePost.length + 1)

        const title = blogsAfterPost.map(blog => blog.title)
        expect(title).toContain('Android 11 latest beta is all about stability')
    })

    test('missing likes defaults to 0', async () => {
        const login = await api
            .post('/api/login')
            .send(loginDetails)

        const testBlog = {
            title: 'Unreal Engine can now capture facial expressions via an official iOS app',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/9/21318440/unreal-engine-facial-capture-ios-app-arkit-truedepth-front-facing-camera-animation',
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${login.body.token}` })
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()
        const likes = blogsAfterPost.map(blog => blog.likes)
        const lastAddedBlog = likes[likes.length - 1]
        expect(lastAddedBlog).toEqual(0)
    })

    test('no title or url', async () => {
        const login = await api
            .post('/api/login')
            .send(loginDetails)

        const testBlog = {
            author: 'Jon Porter'
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${login.body.token}` })
            .send(testBlog)
            .expect(400)

        const blogsAfterPost = await helper.blogsInDb()
        expect(blogsAfterPost.length).toBe(blogsAfterPost.length)
    })
    test('adding blog fails if token is not provided', async () => {
        const blogsBeforePost = await helper.blogsInDb()

        const testBlog = {
            title: 'Android 11 latest beta is all about stability',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/8/21317085/android-11-beta-2-platform-stability-apis-developer-update-google-pixel',
            likes: 2
        }

        if (typeof token === 'undefined') {
            console.log('smt')
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .send(testBlog)
            .expect(401)

        const blogsAfterPost = await helper.blogsInDb()
        expect(blogsAfterPost).toHaveLength(blogsBeforePost.length)
    })
})

describe('deleting blogs',  () => {
    test('delete blog with id', async () => {
        const blogsBeforeDelete = await helper.blogsInDb()

        const login = await api
            .post('/api/login')
            .send(loginDetails)

        const testBlog = {
            title: 'Unreal Engine can now capture facial expressions via an official iOS app',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/9/21318440/unreal-engine-facial-capture-ios-app-arkit-truedepth-front-facing-camera-animation',
        }

        const blogToDelete = blogsBeforeDelete[2]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${login.body.token}` })
            .expect(204)

        const blogsAfterDelete = await helper.blogsInDb()

        expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)
    })
})

describe('updating blogs',  () => {
    test('update blog works', async () => {
        const blogsBeforePut = await helper.blogsInDb()
        const blogToUpdate = blogsBeforePut[0]

        const testBlog = {
            likes: 15
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(testBlog)
            .expect(204)

        const blogsAfterPut = await helper.blogsInDb()

        expect(blogsAfterPut.length).toBe(blogsBeforePut.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})