const pingpong = require('express').Router()

pingpong.get('/', async (request, response) => {
    response.send('pong')
})

module.exports = pingpong
