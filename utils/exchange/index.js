/* eslint-disable */
const fetch = require('node-fetch')
const {
  cobinhoodApiKey = null,
} = require('../../env')

const wordMapping = word => ({
  buy: 'bid',
  ask: 'sell',
})[word] || word

const configMapping = {
  cobinhood: {
    endpoint: 'https://api-staging.cobber.rocks',
  },
}

const body = {
  trading_pair_id: 'COB-ETH',
  price: '0.3',
  type: 'limit',
  side: wordMapping('buy'),
  size: '1000',
}

fetch(`${configMapping.cobinhood.endpoint}/v1/trading/orders`, {
  method: 'POST',
  body:    JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'nonce': Date.now(),
    'authorization': cobinhoodApiKey
  },
})
.then(res => res.json())
.then(json => console.log(json))




class UserExchange {
  constructor({ platform = '', apiKey = '' }) {
    if (!platform || !apiKey) {
      throw Error('platform and apiKey are required')
    }
    this.platform = platform
    this.apiKey = apiKey
  }

  placeOrder() {
    return new Promise((resolve, reject) => {
      resolve('placeOrder')
    })
  }

  getOrders() {
    return new Promise((resolve, reject) => {
      resolve('getOrders')
    })
  }

  cancelAllOrders() {
    return new Promise((resolve, reject) => {
      resolve('cancelAllOrders')
    })
  }
}

module.exports = UserExchange
