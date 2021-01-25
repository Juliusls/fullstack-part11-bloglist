const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('7')
})

module.exports = version
