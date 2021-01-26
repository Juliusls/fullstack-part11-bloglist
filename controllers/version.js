const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('12')
})

module.exports = version
