import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<BLOG />', () => {
    let component
    let updateMockHandler
    let blog = {
        title: 'Random title',
        author: 'Random author',
        likes: 5,
        url: 'http://randomurl.com',
        id: '1'
    }

    beforeEach(() => {
        updateMockHandler = jest.fn()

        component = render(
            <Blog blog={blog} updateLikes={updateMockHandler}/>
        )
    })

    test('renders blogs title and author', () => {
        const hiddenComponent = component.container.querySelector('.hiddenComponent')
        const div = component.container.querySelector('.blog')
        expect(div).toHaveTextContent(
            'Random title'
        )
        expect(div).toHaveTextContent(
            'Random author'
        )
        expect(hiddenComponent).not.toBeVisible()
    })

    test('when like button is clicked twice, the event handler is running twice', () => {
        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)
        expect(updateMockHandler.mock.calls.length).toBe(2)
    })

    test('url and number of likes are shown when view button clicked', () => {
        const hiddenComponent = component.container.querySelector('.hiddenComponent')
        expect(hiddenComponent).toHaveStyle('')

        const button = component.getByText('view')
        fireEvent.click(button)
        expect(hiddenComponent).toHaveStyle('')
    })
})