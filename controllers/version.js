const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('5')
})

module.exports = version
