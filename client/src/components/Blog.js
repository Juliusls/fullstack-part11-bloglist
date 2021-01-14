import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog }) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }
    const buttonText = visible ? 'hide' : 'view'

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle} className='blog'>
            <div className='viewDetails'>
                {blog.title} - {blog.author}<button onClick={toggleVisibility} className='viewHideButton'>{buttonText}</button>
                <div style={showWhenVisible} className='hiddenComponent'>
                    <p style = {{ margin: 0 }}>{blog.url}</p>
                    <p style = {{ margin: 0 }} id='blogLikes'>{blog.likes}<button onClick={() => updateLikes(blog.id)}>like</button></p>
                    <p style = {{ margin: 0 }}>{blog.author}</p>
                    <button onClick={() => deleteBlog(blog.id)}>remove</button>
                </div>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object,
    updateLikes: PropTypes.func,
    deleteBlog: PropTypes.func
}

export default Blog
