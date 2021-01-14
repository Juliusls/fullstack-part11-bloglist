const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }  else if (error.name === 'JsonWebTokenError' && error.message !== 'jwt must be provided') {
        return response.status(401).json({ error: 'invalid token' })
    }   else if (error.name === 'JsonWebTokenError' && error.message === 'jwt must be provided') {
        return response.status(401).json({ error: 'token not provided' })
    }
    next(error)
}

module.exports = {
    tokenExtractor,
    unknownEndpoint,
    errorHandler
}