const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('6')
})

module.exports = version
