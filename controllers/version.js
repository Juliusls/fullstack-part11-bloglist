const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('11')
})

module.exports = version
