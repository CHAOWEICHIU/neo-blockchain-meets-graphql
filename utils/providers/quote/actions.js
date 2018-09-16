const {
  RECEIVED_RATES,
  RECEIVED_ORDER,
  BUFFER_ORDER,
} = require('./constants')

const receivedRates = payload => ({
  type: RECEIVED_RATES,
  payload,
})

const receivedOrder = ({ data, precision, pair }) => ({
  type: RECEIVED_ORDER,
  payload: { data, precision, pair },
})

const bufferOrder = payload => ({
  type: BUFFER_ORDER,
  payload,
})

module.exports = {
  receivedRates,
  receivedOrder,
  bufferOrder,
}
