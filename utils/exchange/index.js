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
