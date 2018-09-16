const { createSelector } = require('reselect')
const { Map, List } = require('immutable')

const selectQuoteProviderDomain = state => state.quote

const makeSelectOrderBooks = () => createSelector(
  selectQuoteProviderDomain,
  quoteState => quoteState.get('orderBooks', Map()),
)

const makeSelectOrderBook = ({ pair }) => createSelector(
  makeSelectOrderBooks(),
  orderBooksState => orderBooksState.get(pair, Map()),
)

const makeSelectPairAskAndBid = ({ pair, count = 1 }) => createSelector(
  makeSelectOrderBook({ pair }),
  (pairInformation) => {
    const asks = pairInformation.get('asks', List())
    const bids = pairInformation.get('bids', List())
    // console.log('qqqqq',pairInformation.get('asks', List()))
    console.log(pair, '\n', 'asks\n', asks.toJS(), '\nbids\n', bids.toJS(), '\n\n\n')
    
    
    return ({
      ask: 1,
      // bid: bids.take(count),
    })
  },
)

module.exports = {
  selectQuoteProviderDomain,
  makeSelectOrderBook,
  makeSelectPairAskAndBid,
}
