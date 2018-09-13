const WebSocket = require('ws')
const moment = require('moment')
// const Big = require('big.js')

const WSS_ENDPOINT = 'wss://ws.cobinhood.com/v2/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

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

const formatTicker = ticker => ({
  timestamp: moment(parseInt(ticker[0], 10)).format('YYYY-MM-DD hh:mm:ss'),
  highestBid: ticker[1],
  lowestAsk: ticker[2],
  volume24HR: ticker[3],
  high24HR: ticker[4],
  low24HR: ticker[5],
  open24HR: ticker[6],
  lastTradePrice: ticker[7],
})

const ws = new WebSocket(WSS_ENDPOINT, {
  headers: {
    Origin: cobinhoodOrigin,
    // Authorization: this.key || '',
    Nonce: new Date().valueOf(),
  },
})


setTimeout(() => {
  const data = JSON.stringify({
    type: 'ticker',
    action: 'subscribe',
    trading_pair_id: 'BTC-USDT',
  })
  ws.send(data)

  setInterval(() => {
    ws.send(JSON.stringify({
      action: 'ping',
    }))
  }, 60 * 1000)
}, 3000)

const onWSMessage = (message) => {
  const msg = formatMsg(JSON.parse(message))
  const data = formatTicker(msg.data)

  console.log('message:\n', message, '\n\n')
  console.log('message:\n', msg, '\n\n')
  console.log('data', data, '\n\n')
  // formatTicker
}
const onWSOpen = (message) => {
  console.log('open', message)
}
const onWSError = (err) => {
  console.log('err', err)
}

const onWSClose = (close) => {
  console.log('close', close)
}

ws.on('message', onWSMessage)
ws.on('open', onWSOpen)
ws.on('error', onWSError)
ws.on('close', onWSClose)
