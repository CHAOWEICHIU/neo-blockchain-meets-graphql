const {
  fromJS,
  List,
} = require('immutable')
const {
  sub,
} = require('../../calculation')
const {
  RECEIVED_RATES,
  RECEIVED_ORDER,
  BUFFER_ORDER,
} = require('./constants')
const {
  COBINHOOD,
  BINANCE,
} = require('../constants')

const initialState = fromJS({
  rates: {
    [COBINHOOD]: [],
    [BINANCE]: [],
  },
  orderBooks: {
    [COBINHOOD]: {
      bids: [],
      asks: [],
      spread: '0',
    },
    [BINANCE]: {
      bids: [],
      asks: [],
      spread: '0',
    },
  },
})

const quoteProviderReducer = (state = initialState, action) => {
  const { type, payload, platform } = action
  switch (type) {
    case RECEIVED_RATES:
      if (platform === COBINHOOD) {
        return state.set(['rates', platform], payload)
      }
      return state
    case BUFFER_ORDER: {
      if (platform === COBINHOOD) {
        const { data, pair } = payload
        let bids = state.getIn(['orderBooks', platform, pair, 'bids'], List())
        let asks = state.getIn(['orderBooks', platform, pair, 'asks'], List())
        const inputBids = data.bids
        const inputAsks = data.asks
        let shouldSort = false

        if (inputBids.length !== 0) {
          shouldSort = false
          inputBids
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
                  shouldSort = true
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

        if (inputAsks.length !== 0) {
          shouldSort = false
          inputAsks
            .map(([price,, amount]) => ({
              price: Number(price),
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
          .setIn(['orderBooks', platform, pair, 'bids'], bids)
          .setIn(['orderBooks', platform, pair, 'asks'], asks)
      }

      return state
    }

    case RECEIVED_ORDER: {
      if (platform === COBINHOOD) {
        const { data, pair } = payload
        const inputAsks = data.asks
        const inputBids = data.bids

        const bids = fromJS(
          inputBids
            .slice(0, 1000)
            .map(([price,, amount]) => ({
              price: Number(price),
              amount: Number(amount),
            })),
        )

        const asks = fromJS(
          inputAsks
            .slice(0, 1000)
            .map(([price,, amount]) => ({
              price: Number(price),
              amount: Number(amount),
            })),
        )

        const highestBid = bids.getIn([0, 'price'], 0)
        const lowestAsk = asks.getIn([0, 'price'], highestBid)
        const spread = sub(lowestAsk, highestBid)

        return state
          .setIn(['orderBooks', platform, pair, 'bids'], bids.sortBy(item => -1 * item.get('price')))
          .setIn(['orderBooks', platform, pair, 'asks'], asks.sortBy(item => item.get('price')))
          .setIn(['orderBooks', platform, pair, 'spread'], spread)
      }
      return state
    }

    default:
      return state
  }
}

module.exports = quoteProviderReducer
