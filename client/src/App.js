import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'
import Blog from './components/Blog'
import Togglable from './components/togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState(null)
    const [messageType, setMessagetype] = useState(null)
    const [user, setUser] = useState(null)
    const [updateBlog, setUpdateBlog] = useState(false)
    const [fetchInProgress, setFetchInProgress] = useState(true)

    useEffect(() => {
        blogService
            .getAll()
            .then(blogs => {
                setBlogs(blogs)
                setFetchInProgress(false)
            })
    }, [updateBlog])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const blogFormRef = useRef()

    const handleLogin = async (userCreditentials) => {
        try {
            const user = await loginService.login(userCreditentials)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            setMessage('Wrong credentials')
            setMessagetype('error')
            setTimeout(() => {
                setMessage(null)
                setMessagetype(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
    }

    const addNewBlog = (newBlog) => {
        try {
            blogFormRef.current.toggleVisibility()
            blogService.setToken(user.token)
            blogService
                .create(newBlog)
                .then(returnedBlog => {
                    setUpdateBlog(!updateBlog)
                    setMessage(`A new blog: '${returnedBlog.title}' by ${returnedBlog.author} added`)
                    setMessagetype('info')
                    setTimeout(() => {
                        setMessage(null)
                        setMessagetype(null)
                    }, 5000)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const updateLikes = id => {
        const blog = blogs.filter(b => b.id === id)
        const changedBlog = { ...blog[0], likes: blog[0].likes + 1 }

        setFetchInProgress(true)

        blogService.setToken(user.token)

        blogService
            .update(id, changedBlog)
            .then(returnedBlog => {
                setUpdateBlog(!updateBlog)
                setMessage(`A blog: ${changedBlog.title} by ${changedBlog.author} liked`)
                setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
                setMessagetype('info')
                setTimeout(() => {
                    setMessage(null)
                    setMessagetype(null)
                }, 5000)
            })
    }

    const deleteBlog = id => {
        const blog = blogs.filter(b => b.id === id)[0]

        if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
            setFetchInProgress(true)

            blogService.setToken(user.token)

            blogService
                .remove(id)
                .then(removedBlog => {
                    setUpdateBlog(!updateBlog)
                    setMessage('Blog removed')
                    setBlogs(blogs.filter(blog => blog.id !== id))
                    setMessagetype('info')
                    setTimeout(() => {
                        setMessage(null)
                        setMessagetype(null)
                    }, 5000)

                })
        }
    }

    const filterBlogs = (blogs) => {
        return blogs
            .filter(blog => blog.user !== null)
            .filter(blog => blog.user.username === user.username)
    }

    const loginForm = () => (
        <LoginForm userCreditentials={handleLogin}/>
    )

    const blogForm = () => (
        <Togglable buttonLabel='New blog' ref={blogFormRef}>
            <BlogForm newBlog={addNewBlog} />
        </Togglable>
    )

    const blogList = () => (
        <div className='blogsDiv'>
            {fetchInProgress
                ? <p>Loading</p>
                :  filterBlogs(blogs)
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog =>
                        <Blog key={String(blog.id)} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog}/>)
            }
        </div>
    )

    return (
        <div>
            {user === null ?
                <div>
                    <Notification message={message} messageType={messageType} />
                    {loginForm()}
                </div>
                : <div>
                    <h2>blogs</h2>
                    <Notification message={message} messageType={messageType} />
                    {`${user.name} logged in`} <button onClick={handleLogout}>log out</button>
                    <br/><br/>
                    {blogForm()}
                    {blogList()}
                </div> }
        </div>
    )
}

export default App