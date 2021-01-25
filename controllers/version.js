const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('10')
})

module.exports = version
