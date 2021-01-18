// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let blogLikes = blogs.map(blog => blog.likes)

    return blogs.length === 0
        ? 0
        : blogLikes.reduce((sum, item) => sum + item, 0)
}

const favoriteBlog = (blogs) => {
    const max = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    const newObj = {
        title: max.title,
        author: max.author,
        likes: max.likes
    }
    return newObj
}

const mostBlogs = (blogs) => {

    let author = blogs[0].author
    let authorsOcurrences = {}

    blogs.forEach(blog => {
        const currentAuthor = blog.author
        console.log('currentAuthor', currentAuthor)

        authorsOcurrences[currentAuthor]
            ? authorsOcurrences[currentAuthor]++
            : authorsOcurrences[currentAuthor] = 1
        console.log('authorsOcurrences', authorsOcurrences)

        if (authorsOcurrences[author] < authorsOcurrences[currentAuthor])
            author = currentAuthor
    })

    return {
        author: author,
        blogs: authorsOcurrences[author]
    }
}

const mostLikes = (blogs) => {
    let authorWithMostLikes = blogs[0].author
    let authorsLikes = {}

    blogs.forEach(blog => {
        const currentAuthor = blog.author

        authorsLikes[currentAuthor]
            ? authorsLikes[currentAuthor] += blog.likes
            : authorsLikes[currentAuthor] = blog.likes

        if (authorsLikes[authorWithMostLikes] < authorsLikes[currentAuthor])
            authorWithMostLikes = currentAuthor
    })

    return {
        author: authorWithMostLikes,
        likes: authorsLikes[authorWithMostLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}