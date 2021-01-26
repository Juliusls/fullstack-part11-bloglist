const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('13')
})

module.exports = version
