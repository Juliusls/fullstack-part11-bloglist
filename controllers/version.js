const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('4')
})

module.exports = version
