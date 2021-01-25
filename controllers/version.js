const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('3')
})

module.exports = version
