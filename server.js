const express = require('express')
const next = require('next')
const expressGraphQL = require('express-graphql')
const schema = require('./lib/schema')
const config = require('./config')
const api = require('./api');
const {
  BLOCKCHAIN_ENV,
} = process.env
const app = next({dev: config[BLOCKCHAIN_ENV].NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()
    /* body parser */
    server.use(require('body-parser').json())

    server.use('/graphql', expressGraphQL({
      graphiql: config[BLOCKCHAIN_ENV].NODE_ENV !== 'production',
      schema,
    }))
    server.use('/api', api)
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(config[BLOCKCHAIN_ENV].SERVER_PORT, (err) => {
      if (err) throw err
      console.log(`> NODE_ENV: ${config[BLOCKCHAIN_ENV].NODE_ENV}`)
      console.log(`> Server running on PORT: ${config[BLOCKCHAIN_ENV].SERVER_PORT}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
