const { range, flatten } = require('lodash')
const {
  ws,
  subscribeOrder,
  formatMsg,
  placeOrder, /* eslint-disable-line */
} = require('../../services/cobinhood/webSocket')
const { getOpenOrders } = require('../../services/cobinhood/index')
const {
  receivedOrders,
  receivedOrder,
} = require('./actions')
const { store } = require('../index')
const { processLimitOrderFromWebSocket } = require('./utils')

const limit = 100

/*
* Example to place order via web socket
  placeOrder({
    trading_pair_id: 'BTC-USDT',
    type: '0',
    price: '6314.3',
    size: '0.5',
    side: 'bid',
    source: 'exchange',
  })
*/

getOpenOrders({ limit })
  .then((res) => {
    Promise.all(
      range(1, res.result.total_page + 1)
        .map(page => getOpenOrders({ limit, page })),
    )
      .then(responses => flatten(responses.map(response => response.result.orders)))
      .then((orders) => {
        store.dispatch(receivedOrders(orders))
        subscribeOrder()

        ws.on('message', (msg) => {
          const { channel, data, type } = formatMsg(JSON.parse(msg))
          if (type === 'subscribed') return
          if (channel === 'order') {
            /*
            [ 'cc69f653-0d33-47f2-9094-68ea62ec3601',
              '1537404887168',
              '',
              'BTC-USDT',
              'queued',
              '',
              'bid',
              '6314.3',
              '0',
              '0.5',
              '0',
              'exchange' ]
            [ 'cc69f653-0d33-47f2-9094-68ea62ec3601',
              '1537404887168',
              '',
              'BTC-USDT',
              'open',
              'opened',
              'bid',
              '6314.3',
              '0',
              '0.5',
              '0',
              'exchange' ]
            */
            store.dispatch(receivedOrder(processLimitOrderFromWebSocket(data)))
          }
        })
      })
  })
