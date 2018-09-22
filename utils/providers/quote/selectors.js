const { createSelector } = require('reselect')
const { Map, List } = require('immutable')

const selectQuoteProviderDomain = state => state.quote

const makeSelectOrderBooks = ({ platform }) => createSelector(
  selectQuoteProviderDomain,
  quoteState => quoteState.getIn(['orderBooks', platform], Map()),
)

const makeSelectOrderBook = ({ pair, platform }) => createSelector(
  makeSelectOrderBooks({ platform }),
  orderBooksState => orderBooksState.get(pair, Map()),
)

const makeSelectPairAskAndBid = ({ pair, count = 1, platform }) => createSelector(
  makeSelectOrderBook({ pair, platform }),
  (pairInformation) => {
    const asks = pairInformation.get('asks', List())
    const bids = pairInformation.get('bids', List())
    return ({
      asks: asks.take(count),
      bids: bids.take(count),
    })
  },
)

module.exports = {
  selectQuoteProviderDomain,
  makeSelectOrderBook,
  makeSelectPairAskAndBid,
}
