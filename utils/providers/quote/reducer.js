const { fromJS, List } = require('immutable')
const {
  RECEIVED_RATES,
  RECEIVED_ORDER,
  BUFFER_ORDER,
} = require('./constants')

const initialState = fromJS({
  rates: [],
  orderBooks: {},
})

const quoteProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_RATES:
      return state.set('rates', action.payload)
    case BUFFER_ORDER: {
      const {
        data,
        pair,
      } = action.payload

      let bids = state.getIn(['orderBooks', pair, 'bids'], List())
      let asks = state.getIn(['orderBooks', pair, 'asks'], List())
      let shouldSort = false

      if (data.bids.length !== 0) {
        shouldSort = false
        data.bids
          .map(([price,, amount]) => ({
            price: Number(price),
            amount: Number(amount),
          }))
          .forEach(({ price, amount }) => {
            if (!amount) {
              bids = bids
                .filter(item => item.get('price') !== price)
            } else {
              const index = bids.findIndex(item => item.get('price') === price)
              if (index === -1) {
                bids = bids
                  .push(fromJS({
                    price,
                    amount,
                  }))
              } else {
                bids = bids
                  .update(
                    index,
                    item => item.update('amount', value => value + amount),
                  )
              }
            }
          })
        if (shouldSort) {
          bids = bids.sortBy(item => -1 * item.get('price'))
        }
        bids = bids.filter(item => item.get('amount') > 1E-8)
      }


      if (asks.length) {
        shouldSort = false
        asks
          .map(([price,, amount]) => ({
            price: Number(price),
            // count: Number(count),
            amount: Number(amount),
          }))
          .forEach(({ price, amount }) => {
            if (!amount) {
              asks = asks
                .filter(item => item.get('price') !== price)
            } else {
              const index = asks.findIndex(item => item.get('price') === price)

              if (index === -1) {
                shouldSort = true
                asks = asks
                  .push(fromJS({
                    price,
                    amount,
                  }))
              } else {
                asks = asks
                  .update(
                    index,
                    item => item.update('amount', value => value + amount),
                  )
              }
            }
          })
        if (shouldSort) {
          asks = asks.sortBy(item => item.get('price'))
        }
        asks = asks.filter(item => item.get('amount') > 1E-8)
      }

      return state
        .setIn(['orderBooks', pair, 'bids'], bids.take(3))
        .setIn(['orderBooks', pair, 'asks'], asks.take(3))
    }

    case RECEIVED_ORDER: {
      const {
        data,
        precision = state.getIn(['precisions', 0], 0.000001),
        pair,
      } = action.payload

      const inputAsks = data.asks
      const inputBids = data.bids

      let totalBids = 0

      const bids = fromJS(
        inputBids
          .slice(0, 1000)
          .map(([price, count, amount]) => ({
            price: Number(price),
            count: Number(count),
            amount: Number(amount),
          }))
          .map(({ price, count, amount }) => {
            totalBids += Number(amount)
            return {
              price,
              count,
              amount,
              total: totalBids,
            }
          }),
      )

      let totalAsks = 0
      const asks = fromJS(
        inputAsks
          .slice(0, 1000)
          .map(([price, count, amount]) => ({
            price: Number(price),
            count: Number(count),
            amount: Number(amount),
          }))
          .map(({ price, count, amount }) => {
            totalAsks += Number(amount)
            return {
              price,
              count,
              amount,
              total: totalAsks,
            }
          }),
      )

      const highestBid = bids.getIn([0, 'price'], 0)
      const lowestAsk = asks.getIn([0, 'price'], highestBid)
      const spread = lowestAsk - highestBid

      return state
        .setIn(['orderBooks', pair, 'precision'], precision)
        .setIn(['orderBooks', pair, 'bids'], bids.take(3))
        .setIn(['orderBooks', pair, 'asks'], asks.take(3))
        .setIn(['orderBooks', pair, 'spread'], spread)
    }
    default:
      return state
  }
}

module.exports = quoteProviderReducer
