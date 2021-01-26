const version = require('express').Router()

version.get('/', async (request, response) => {
    response.send('14')
})

module.exports = version
