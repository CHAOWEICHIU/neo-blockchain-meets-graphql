const {
  RECEIVED_ORDERS,
  RECEIVED_ORDER,
} = require('./constants')

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
