const getLogger = require('loglevel-colored-level-prefix')

/*
  Logger
    - TRACE (Gray)
      trace(msg)

    - DEBUG (Light Blue)
      debug(msg)

    - INFO  (Blue)
      info(msg)

    - WARN  (Yellow)
      warn(msg)

    - ERROR (Red)
      error(msg)

*/

module.exports = {
  systemLogger: ({ message }) => getLogger({ prefix: '[SYSTEM]', level: 'trace' }).info(`\n${message}\n`),
  wsWarning: ({ message }) => getLogger({ prefix: '[WEBSOCKET]', level: 'error' }).error(`\n${message}\n`),
  wsError: ({ message }) => getLogger({ prefix: '[WEBSOCKET]', level: 'warn' }).warn(`\n${message}\n`),
  wsInfo: ({ message }) => getLogger({ prefix: '[WEBSOCKET]', level: 'info' }).info(`\n${message}\n`),
  arbitrageLogger: ({ message }) => getLogger({ prefix: '[ARBITRAGE]', level: 'info' }).info(`\n${message}\n`),
}
