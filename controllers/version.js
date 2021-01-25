const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('8')
})

module.exports = version
