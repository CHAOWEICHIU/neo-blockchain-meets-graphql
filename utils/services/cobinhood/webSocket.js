const WebSocket = require('ws')
const { configMapping } = require('../constants')

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
    // Authorization: this.key || '',
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

ws.on('open', () => {
  setInterval(() => {
    ws.send(JSON.stringify({
      action: 'ping',
    }))
  }, 60 * 1000)
})
ws.on('error', err => console.error(err))
ws.on('close', () => console.log('close'))

module.exports = {
  ws,
  subscribeOrderBook,
  formatMsg,
}
