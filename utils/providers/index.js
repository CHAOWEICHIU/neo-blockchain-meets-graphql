/* eslint-disable */
const moment = require('moment')
const { min } = require('lodash')
const { createStore, combineReducers } = require('redux')
const quoteProviderReducer = require('./quote/reducer')
const { mul, div } = require('../calculation')
const { selectQuoteProviderDomain, makeSelectPairAskAndBid, makeSelectOrderBook } = require('./quote/selectors')

const store = createStore(
  combineReducers({
    quote: quoteProviderReducer,
  })
)

module.exports = {
  store,
}

/* Logic to fetch data */
require('./quote')


store.subscribe(() => {
  const { asks: eth } = makeSelectPairAskAndBid({ pair: 'ETH-USDT', count: 1 })(store.getState())
  const { bids: btc } = makeSelectPairAskAndBid({ pair: 'ETH-BTC', count: 1 })(store.getState())
  const { bids: usdt } = makeSelectPairAskAndBid({ pair: 'BTC-USDT', count: 1 })(store.getState())

  /* arbitrage = USDT -> ETH -> BTC -> USDT */
  let arbitrageA = mul(
    div(1000, eth.getIn([0, 'price'])),
    btc.getIn([0, 'price']),
    usdt.getIn([0, 'price']),
  )
  let maxEthTradableAmount = min([
      mul([
        min([
          div(eth.getIn([0,'amount']),eth.getIn([0, 'price'])),
          btc.getIn([0, 'amount'])
        ]),
        btc.getIn([0, 'price']),
      ]),
      usdt.getIn([0, 'amount'])
    ])
  
  console.log(arbitrageA);
  console.log(maxEthTradableAmount);
  console.log('\n');
  
  
  
  
  
  
  

  // console.log(moment().format('YYYY-MM-DD hh:mm:ss'),JSON.stringify(r, null, 2), '\n\n');
})

