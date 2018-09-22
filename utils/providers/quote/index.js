const { getRates } = require('../../services/cobinhood')
const {
  receivedRates,
  receivedOrder,
  bufferOrder,
} = require('./actions')
const { store } = require('../index')
const {
  ws,
  subscribeOrderBook,
  formatMsg,
} = require('../../services/cobinhood/webSocket')
const {
  COBINHOOD,
} = require('../constants')

const neededCurrenciesRate = [
  'ETH',
  'BTC',
]

Promise
  .all(neededCurrenciesRate.map(neededCurrencyRate => getRates({ currencyId: neededCurrencyRate })))
  .then(ratesResponse => ratesResponse.map(x => x.result))
  .then(data => store.dispatch(receivedRates({ payload: data, platform: COBINHOOD })))
  .then(() => {
    subscribeOrderBook({ pair: 'ETH-USDT' })
    subscribeOrderBook({ pair: 'ETH-BTC' })
    subscribeOrderBook({ pair: 'BTC-USDT' })

    ws.on('message', (response) => {
      const message = formatMsg(JSON.parse(response))
      const { data } = message
      const [type, pair] = message.channel.split('.')
      if (type === 'order-book') {
        if (message.type === 'snapshot') {
          return store.dispatch(receivedOrder({
            payload: { pair, data },
            platform: COBINHOOD,
          }))
        }
        if (message.type === 'update') {
          return store.dispatch(bufferOrder({
            payload: { pair, data },
            platform: COBINHOOD,
          }))
        }
      }
      return ''
    })
  })
