const moment = require('moment')
const { min } = require('lodash')
const { createStore, combineReducers } = require('redux')
const { arbitrageLogger } = require('../logger')
const quoteProviderReducer = require('./quote/reducer')
const orderProviderReducer = require('./order/reducer')
const { mul, div } = require('../calculation')
const { makeSelectPairAskAndBid } = require('./quote/selectors')

const store = createStore(
  combineReducers({
    quote: quoteProviderReducer,
    order: orderProviderReducer,
  }),
)

module.exports = {
  store,
}

/* Logic to fetch data */
require('./quote')
require('./order')

const base = 1000

const arbitrage = ({
  askEth,
  buyEth,
  askBtc,
  buyBtc,
  askUsdt,
  buyUsdt,
}) => ({
  arbitrageBuy: div(
    mul(base, buyEth.getIn([0, 'price'])),
    askBtc.getIn([0, 'price']),
    askUsdt.getIn([0, 'price']),
  ),
  maxForBuy: min([
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
  ]),
  arbitrageSell: mul(
    div(base, askEth.getIn([0, 'price'])),
    buyBtc.getIn([0, 'price']),
    buyUsdt.getIn([0, 'price']),
  ),
  maxForSell: min([
    mul([
      min([
        div(askEth.getIn([0, 'amount']), askEth.getIn([0, 'price'])),
        buyBtc.getIn([0, 'amount']),
      ]),
      buyBtc.getIn([0, 'price']),
    ]),
    buyUsdt.getIn([0, 'amount']),
  ]),
})

const logging = ({
  arbitrageBuy,
  maxForBuy,
  arbitrageSell,
  maxForSell,
  flow,
}) => {
  const log = `
  ${moment().format('YYYY-MM-DD hh:mm:ss')}
  ${flow}

  Arbitrage Buy
  ${arbitrageBuy}
  Max Amount
  ${maxForBuy}

  Arbitrage Sell
  ${arbitrageSell}
  Max Amount
  ${maxForSell}
  `

  if (arbitrageBuy > base || arbitrageSell > base) {
    arbitrageLogger(log)
  }
}

store.subscribe(() => {
  const { asks: askEth, bids: buyEth } = makeSelectPairAskAndBid({ pair: 'ETH-USDT', count: 1 })(store.getState())
  const { bids: buyBtc, asks: askBtc } = makeSelectPairAskAndBid({ pair: 'ETH-BTC', count: 1 })(store.getState())
  const { bids: buyUsdt, asks: askUsdt } = makeSelectPairAskAndBid({ pair: 'BTC-USDT', count: 1 })(store.getState())

  /* arbitrage = USDT -> ETH -> BTC -> USDT */
  logging(
    arbitrage({
      flow: 'USDT.ETH.BTC.USDT',
      askEth,
      buyEth,
      buyBtc,
      askBtc,
      buyUsdt,
      askUsdt,
    }),
  )
})
