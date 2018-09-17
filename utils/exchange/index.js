const {
  placeOrder,
  cancelOrder,
  getOpenOrders,
} = require('../services/cobinhood/index')

const wordMapping = word => ({
  buy: 'bid',
  ask: 'sell',
})[word] || word

/* eslint-disable */
class UserExchange {
  constructor({ platform = '', apiKey = '' }) {
    if (!platform || !apiKey) {
      throw Error('platform and apiKey are required')
    }
    this.platform = platform
    this.apiKey = apiKey
  }

  placeOrder({ tradingPairId, price, type, side, size }) {
    return placeOrder({
      tradingPairId,
      type,
      price,
      side: wordMapping(side),
      size,
    })
  }

  getOrders() {
    return new Promise((resolve, reject) => {
      resolve('getOrders')
    })
  }

  cancelOrder({ orderId }) {
    return cancelOrder({
      orderId,
    })
  }

  cancelAllOrders({ tradingPairId }) {
    if(tradingPairId) {
      return getOpenOrders({ tradingPairId })
        .then(({ orders }) => orders.map(order => order.id))
        .then(orderIds => batchCancelOrders({ tradingPairId, orderIds }))  
    }
    return Promise.reject({ reason: 'tradingPairId needed' })
  }
}

module.exports = UserExchange
