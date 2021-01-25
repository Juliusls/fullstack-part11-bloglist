const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('9')
})

module.exports = version
