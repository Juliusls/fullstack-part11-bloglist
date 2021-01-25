const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('2')
})

module.exports = version
