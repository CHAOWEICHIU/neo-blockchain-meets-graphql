const WebSocket = require('ws')
const moment = require('moment')
const _ = require('lodash')
// const Big = require('big.js')

const WSS_ENDPOINT = 'wss://ws.cobinhood.com/v2/ws'
const cobinhoodOrigin = 'https://cobinhood.com'

/*
* utils
*/
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

const formatPricePoint = (point) => ({
  price: point[0],
  count: parseInt(point[1], 10),
  size: point[2],
})

const formatPricePointUpdate = (point) => ({
  price: point[0],
  countDiff: parseInt(point[1], 10),
  sizeDiff: point[2],
})


/*
* constants
*/
const mapping = {
  ticker: {
    type: 'ticker',
    format: formatTicker,
  },
  orderbook: {
    type: 'order-book',
    // format: formatOrdebook,
  },
}

/*
* Main
*/

const orderbook = {
  bids: [],
  asks: [],
}

const ws = new WebSocket(WSS_ENDPOINT, {
  headers: {
    Origin: cobinhoodOrigin,
    // Authorization: this.key || '',
    Nonce: new Date().valueOf(),
  },
})

setTimeout(() => {
  /* Ticker */
  /*
  const data = JSON.stringify({
    type: 'ticker',
    action: 'subscribe',
    trading_pair_id: 'BTC-USDT',
  })
  */

  const data = JSON.stringify({
    type: mapping.orderbook.type,
    action: 'subscribe',
    trading_pair_id: 'ETH-BTC',
    precision: '1E-6',
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
  // const data = msg.type === 'update'
  //   ? ({
  //     bids: _.isEmpty(msg.data.bids) ? [] : msg.data.bids.map(formatPricePointUpdate),
  //     asks: _.isEmpty(msg.data.asks) ? [] : msg.data.asks.map(formatPricePointUpdate),
  //   })
  //   : ({
  //     bids: _.isEmpty(msg.data.bids) ? [] : msg.data.bids.map(formatPricePoint),
  //     asks: _.isEmpty(msg.data.asks) ? [] : msg.data.asks.map(formatPricePoint),
  //   })
  if (msg.type === 'update') {
    
    
  } else {
    orderbook.bids.push(_.isEmpty(msg.data.bids) ? [] : msg.data.bids.map(formatPricePoint))
    orderbook.asks.push(_.isEmpty(msg.data.asks) ? [] : msg.data.asks.map(formatPricePoint))

    console.log(orderbook)
    // orderbook.bids.push(_.isEmpty(msg.data.bids) ? [] : msg.data.bids.map(formatPricePointUpdate))
    // orderbook.asks.push(_.isEmpty(msg.data.asks) ? [] : msg.data.asks.map(formatPricePointUpdate))
  }

  // console.log('message:\n', message, '\n\n')
  // console.log('message:\n', msg, '\n\n')
  console.log('data', orderbook, '\n\n')
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
