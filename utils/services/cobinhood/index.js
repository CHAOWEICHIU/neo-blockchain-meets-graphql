const { toUpper } = require('lodash')
const queryString = require('query-string');
const { apiGet, apiPost, apiDelete } = require('./rest')

const getRates = ({ currencyId }) => apiGet({
  url: `/v1/market/exchange_rates/${toUpper(currencyId)}`,
})

const getOpenOrders = ({ tradingPairId, limit = 100, page }) => apiGet({
  url: `/v1/trading/orders?${queryString.stringify(Object.assign(
    {},
    tradingPairId ? { trading_pair_id: tradingPairId } : {},
    limit ? { limit } : {},
    page ? { page } : {},
  ))}`,
})

const placeOrder = ({
  tradingPairId,
  type,
  price,
  side,
  size,
}) => apiPost({
  url: '/v1/trading/orders',
  body: {
    trading_pair_id: tradingPairId,
    price,
    type,
    side,
    size,
  },
})

const cancelOrder = ({
  orderId,
}) => apiDelete({
  url: `/v1/trading/orders/${orderId}`,
})

const batchCancelOrders = ({
  orderIds,
}) => apiDelete({
  url: '/v1/trading/order_batch',
  body: {
    order_id: orderIds,
  },
})


module.exports = {
  getRates,
  placeOrder,
  cancelOrder,
  getOpenOrders,
  batchCancelOrders,
}
