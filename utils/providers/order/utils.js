/* eslint-disable no-unused-vars */

const processLimitOrderFromWebSocket = ([
  orderId,
  timestamp,
  completedAt,
  tradingPairId,
  state,
  event,
  side,
  price,
  eqPrice,
  size,
  partialFilledSize,
  source,
]) => ({
  id: orderId,
  trading_pair_id: tradingPairId,
  side,
  type: 'limit',
  price,
  size,
  filled: partialFilledSize,
  state,
  timestamp,
  eq_price: eqPrice,
  completed_at: completedAt,
  source,
})


module.exports = {
  processLimitOrderFromWebSocket,
}
