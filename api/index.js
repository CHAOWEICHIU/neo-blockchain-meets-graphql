const express = require('express')
const app = express()
const bot = require('./bot')
app.use('/bot', bot)

module.exports = app;
