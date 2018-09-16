const moment = require('moment')
const { min } = require('lodash')
const { createStore, combineReducers } = require('redux')
const quoteProviderReducer = require('./quote/reducer')
const { mul, div } = require('../calculation')
const { makeSelectPairAskAndBid } = require('./quote/selectors')

const store = createStore(
  combineReducers({
    quote: quoteProviderReducer,
  }),
)

module.exports = {
  store,
}

/* Logic to fetch data */
require('./quote')


store.subscribe(() => {
  const { asks: askEth, bids: buyEth } = makeSelectPairAskAndBid({ pair: 'ETH-USDT', count: 1 })(store.getState())
  const { bids: buyBtc, asks: askBtc } = makeSelectPairAskAndBid({ pair: 'ETH-BTC', count: 1 })(store.getState())
  const { bids: buyUsdt, asks: askUsdt } = makeSelectPairAskAndBid({ pair: 'BTC-USDT', count: 1 })(store.getState())

  /* arbitrage = USDT -> ETH -> BTC -> USDT */

  const arbitrageBuy = div(
    mul(1000, buyEth.getIn([0, 'price'])),
    askBtc.getIn([0, 'price']),
    askUsdt.getIn([0, 'price']),
  )

  const maxForBuy = min([
    div(
      min([
        mul(
          buyEth.getIn([0, 'amount']),
          buyEth.getIn([0, 'price']),
        ),
        askBtc.getIn([0, 'amount']),
      ]),
      askBtc.getIn([0, 'price']),
    ),
    askUsdt.getIn([0, 'amount']),
  ])

  const arbitrageSell = mul(
    div(1000, askEth.getIn([0, 'price'])),
    buyBtc.getIn([0, 'price']),
    buyUsdt.getIn([0, 'price']),
  )

  const maxForSell = min([
    mul([
      min([
        div(askEth.getIn([0, 'amount']), askEth.getIn([0, 'price'])),
        buyBtc.getIn([0, 'amount']),
      ]),
      buyBtc.getIn([0, 'price']),
    ]),
    buyUsdt.getIn([0, 'amount']),
  ])

  console.log(`
  ${moment().format('YYYY-MM-DD hh:mm:ss')}

  Arbitrage Buy
  ${arbitrageBuy}
  Max Amount
  ${maxForBuy}

  Arbitrage Sell
  ${arbitrageSell}
  Max Amount
  ${maxForSell}





  `)
})
