const { RECEIVED_ORDERS } = require('./constants')

const receivedOrders = payload => ({
  type: RECEIVED_ORDERS,
  payload,
})

module.exports = {
  receivedOrders,
}
