const express = require('express')
const next = require('next')
const expressGraphQL = require('express-graphql')
const { basename } = require('path')
const { readFileSync } = require('fs')
const accepts = require('accepts')
const glob = require('glob')
const schema = require('./lib/schema')
const config = require('./config')
const api = require('./api');
const {
  BLOCKCHAIN_ENV,
} = process.env
const app = next({dev: config[BLOCKCHAIN_ENV].NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

// Get the supported languages by looking for translations in the `./utils/languages` dir.
const languages = glob.sync('./utils/languages/*.json').map((f) => basename(f, '.json'))

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0]
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }
  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale) => {
  return require(`./utils/languages/${locale}.json`)
}

app
  .prepare()
  .then(() => {
    const server = express()
    /* body parser */
    server.use(require('body-parser').json())
    server.use((req, res, next) => {
      /* Intl */
      const accept = accepts(req)
      const locale = accept.languages(languages)
      req.locale = locale
      req.localeDataScript = getLocaleDataScript(locale)
      req.messages = getMessages(locale)
      next()
    })

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
