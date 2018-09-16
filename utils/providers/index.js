/* eslint-disable */
const moment = require('moment')
const { createStore, combineReducers } = require('redux')
const quoteProviderReducer = require('./quote/reducer')
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
  // selectQuoteProviderDomain(store.getState())
  // console.log(store.getState().quote.getIorderBooks', 'ETH-BTC', 'bids', 0]));
  let r = makeSelectPairAskAndBid({ pair: 'ETH-USDT', count: 1 })(store.getState())
  
  console.log(moment().format('YYYY-MM-DD hh:mm:ss'),JSON.stringify(r, null, 2), '\n\n');
})

