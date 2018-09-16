/* eslint-disable */
const { createStore, combineReducers } = require('redux')
const quoteProviderReducer = require('./quote/reducer')
const { selectQuoteProviderDomain, makeSelectPairAskAndBid } = require('./quote/selectors')

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
  // console.log(store.getState().quote.getIn(['orderBooks', 'ETH-BTC', 'bids', 0]));
  let r = makeSelectPairAskAndBid({ pair: 'ETH-BTC', count: 1 })(store.getState())
  console.log(r);
})

