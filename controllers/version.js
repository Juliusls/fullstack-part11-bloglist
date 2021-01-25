const healthCheckRouter = require('express').Router()

healthCheckRouter.get('/', async (request, response) => {
    response.send('1')
})

module.exports = healthCheckRouter
