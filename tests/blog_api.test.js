const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Backend testing',
        author: 'Julius',
        url: 'https://theverge.com/'
    },
    {
        title: 'Test the backend',
        author: 'Julius',
        url: 'https://theverge.com/'
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const initBlogObjects = initialBlogs.map((blog) => new Blog(blog))
    const promiseObjectsArray = initBlogObjects.map((blog) => blog.save())
    await Promise.all(promiseObjectsArray)
})

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
    let token = null
    beforeAll(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('mypassword', 10)
        const user = new User({ username: 'julius', passwordHash })

        await user.save()

        await api
            .post('/api/login')
            .send({ username: 'julius', password: 'mypassword' })
            .then((res) => {
                return (token = res.body.token)
            })

        return token
    })
    test('a valid blog can be added', async () => {
        const blogsBeforePost = await helper.blogsInDb()

        const testBlog = {
            title: 'Android 11 latest beta is all about stability',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/8/21317085/android-11-beta-2-platform-stability-apis-developer-update-google-pixel',
            likes: 2
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()
        expect(blogsAfterPost).toHaveLength(blogsBeforePost.length + 1)

        const title = blogsAfterPost.map(blog => blog.title)
        expect(title).toContain('Android 11 latest beta is all about stability')
    })

    test('missing likes defaults to 0', async () => {

        const testBlog = {
            title: 'Unreal Engine can now capture facial expressions via an official iOS app',
            author: 'Jon Porter',
            url: 'https://www.theverge.com/2020/7/9/21318440/unreal-engine-facial-capture-ios-app-arkit-truedepth-front-facing-camera-animation',
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfterPost = await helper.blogsInDb()
        const likes = blogsAfterPost.map(blog => blog.likes)
        const lastAddedBlog = likes[likes.length - 1]
        expect(lastAddedBlog).toEqual(0)
    })

    test('no title or url', async () => {
        const testBlog = {
            author: 'Jon Porter'
        }

        await api
            .post('/api/blogs')
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${token}` })
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
            console.log('Log from inside of: adding blog fails if token is not provided')
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
    let token = null
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('mypassword', 10)
        const user = new User({ username: 'julius', passwordHash })

        await user.save()

        await api
            .post('/api/login')
            .send({ username: 'julius', password: 'mypassword' })
            .then((res) => {
                return (token = res.body.token)
            })

        return token
    })
    test('delete blog with id', async () => {
        const blogForDeleteTest = {
            title: 'Test the backend',
            author: 'Julius',
            url: 'https://theverge.com/'
        }

        await api
            .post('/api/blogs')
            .send(blogForDeleteTest)
            // eslint-disable-next-line quotes
            .set('Authorization', `Bearer ${token}`)
            .expect(201)

        const blogsBeforeDelete = await Blog.find({}).populate('user')

        const blogToDelete = blogsBeforeDelete[2]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            // eslint-disable-next-line quotes
            .set({ "Authorization": `Bearer ${token}` })
            .expect(204)

        const blogsAfterDelete = await helper.blogsInDb()

        expect(blogsAfterDelete.length).toBe(blogsBeforeDelete.length - 1)
    })
})

describe('updating blogs',  () => {
    let token = null
    beforeAll(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('mypassword', 10)
        const user = new User({ username: 'julius', passwordHash })

        await user.save()

        await api
            .post('/api/login')
            .send({ username: 'julius', password: 'mypassword' })
            .then((res) => {
                return (token = res.body.token)
            })

        return token
    })
    test('update blog works', async () => {
        const blogsBeforePut = await helper.blogsInDb()
        const blogToUpdate = blogsBeforePut[0]

        const testBlog = {
            likes: 15
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(testBlog)
            // eslint-disable-next-line quotes
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAfterPut = await helper.blogsInDb()

        expect(blogsAfterPut.length).toBe(blogsBeforePut.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})