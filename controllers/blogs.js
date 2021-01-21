const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const notes = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(notes)
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)

        if (!body.title || !body.url) {
            return response
                .status(400)
                .json({
                    error: 'title or url missing'
                })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        console.log(blog)

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const blog = await Blog.findById(request.params.id)

    console.log('blog.user.toString()', blog.user.toString())
    console.log('decodedToken.id.toString()', decodedToken.id.toString())

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({
            error: 'missing or invalid token'
        })
    }
    try {
        if (blog.user.toString() === decodedToken.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } else {
            response.status(401).json({
                error: 'blog can only be deleted by its creator'
            })
        }
    } catch (error) {
        response.status(400).end()
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        likes: body.likes,
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.status(204).json(updatedBlog.toJSON())
        })
        .catch(error => next(error))
})

module.exports = blogsRouter