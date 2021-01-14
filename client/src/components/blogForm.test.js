import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './blogForm'

describe('BlogForm', () => {
    const blog = {
        title: 'Random Title',
        author: 'Random Author',
        url: 'http://randomurl.com'
    }

    const createBlog = jest.fn()

    const component = render(
        <BlogForm newBlog={createBlog}/>
    )

    test('new blog receives correct data', () => {
        const form = component.container.querySelector('.blogForm')
        const titleInput = component.container.querySelector('.titleInput')
        const authorInput = component.container.querySelector('.authorInput')
        const urlInput = component.container.querySelector('.urlInput')

        fireEvent.change(titleInput, {
            target: { value: blog.title },
        })
        fireEvent.change(authorInput, {
            target: { value: blog.author },
        })
        fireEvent.change(urlInput, {
            target: { value: blog.url },
        })

        expect(titleInput.value).toBe(blog.title)
        expect(authorInput.value).toBe(blog.author)
        expect(urlInput.value).toBe(blog.url)

        fireEvent.submit(form)
        expect(createBlog).toHaveBeenCalledWith(blog)
    })
})