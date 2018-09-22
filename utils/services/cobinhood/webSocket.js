const WebSocket = require('ws')
const { configMapping } = require('../constants')
const {
  wsWarning,
  wsError,
  wsInfo,
} = require('../../logger')
const { cobinhoodApiKey } = require('../../../env')

const typeMapping = word => ({
  s: 'snapshot',
  u: 'update',
})[word] || word

const formatMsg = msg => ({
  channel: msg.h[0],
  version: msg.h[1],
  type: typeMapping(msg.h[2]),
  // code: msg.h[3],
  // desc: msg.h[4],
  data: msg.d,
})

const ws = new WebSocket(configMapping.cobinhood.wsEndpoint, {
  headers: {
    Origin: configMapping.cobinhood.origin,
    Authorization: cobinhoodApiKey || '',
    Nonce: new Date().valueOf(),
  },
})

const subscribeOrderBook = ({ pair }) => {
  const data = {
    action: 'subscribe',
    type: 'order-book',
    trading_pair_id: pair,
  }
  ws.send(JSON.stringify(data))
}

const placeOrder = ({
  tradingPairId,
  type = '0',
  /*
  * 0: limit
  * 1: market
  * 2: stop
  * 3: limit_stop
  * 4: trailing_fiat_stop (not valid yet)
  * 5: fill_or_kill (not valid yet)
  * 6: trailing_percent_stop (not valid yet)
  */

  price,
  side,
  size,
}) => {
  const data = {
    action: 'place_order',
    trading_pair_id: tradingPairId,
    type,
    price,
    size,
    side,
    source: 'exchange',
    id: Date.now(),
  }
  ws.send(JSON.stringify(data))
}

const subscribeOrder = () => {
  const data = {
    action: 'subscribe',
    type: 'order',
  }
  ws.send(JSON.stringify(data))
}

ws.on('open', () => {
  setInterval(() => {
    ws.send(JSON.stringify({
      action: 'ping',
    }))
  }, 60 * 1000)
})
ws.on('message', (msg) => {
  const { type, channel } = formatMsg(JSON.parse(msg))
  if (type === 'subscribed') {
    wsInfo({ message: `${channel} subscribed` })
  }
})
ws.on('error', err => wsError({ message: err }))
ws.on('close', () => wsWarning({ message: 'CLOSE' }))

module.exports = {
  ws,
  subscribeOrderBook,
  subscribeOrder,
  placeOrder,
  formatMsg,
}
