const { RECEIVED_ORDERS } = require('./constants')

const receivedOrders = payload => ({
  type: RECEIVED_ORDERS,
  payload,
})

const receivedOrder = payload => ({
  type: RECEIVED_ORDER,
  payload,
})

module.exports = {
  receivedOrders,
  receivedOrder,
}
