const {
  RECEIVED_RATES,
  RECEIVED_ORDER,
  BUFFER_ORDER,
} = require('./constants')

const receivedRates = ({ payload, platform }) => ({
  type: RECEIVED_RATES,
  platform,
  payload,
})

const receivedOrder = ({ payload: { data, precision, pair }, platform }) => ({
  type: RECEIVED_ORDER,
  platform,
  payload: { data, precision, pair },
})

const bufferOrder = ({ payload, platform }) => ({
  type: BUFFER_ORDER,
  platform,
  payload,
})

module.exports = {
  receivedRates,
  receivedOrder,
  bufferOrder,
}
