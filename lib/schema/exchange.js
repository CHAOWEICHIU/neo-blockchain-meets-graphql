const graphql = require('graphql');
const _ = require('lodash');
const request = require('superagent');

const {
  GraphQLObjectType,
  GraphQLString,
  // GraphQLInt,
  // GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = graphql;

const OrderDetail = new GraphQLObjectType({
  name: 'OrderDetail',
  fields: {
    count: { type: GraphQLFloat },
    price: { type: GraphQLFloat },
  },
});

const OrderBookPair = new GraphQLObjectType({
  name: 'OrderBookPair',
  fields: {
    currencyPair: { type: GraphQLString },
    platform: { type: GraphQLString },
    highestSell: { type: OrderDetail },
    lowestBuy: { type: OrderDetail },
  },
});

const orderbookByCurrencyPairDataFromCobinhood = currencyPair => request
  .get(`https://api.cobinhood.com/v1/market/orderbooks/${currencyPair}`)
  .then((res) => {
    const { bids, asks } = res.body.result.orderbook;
    const isDesc = true;
    const sortedBuys = _.orderBy(
      bids.map(x => ({
        count: _.toNumber(x[2]),
        price: _.toNumber(x[0]),
      })),
      ['price'],
      [isDesc ? 'desc' : 'asc'],
    );
    const sortedSells = _.orderBy(
      asks.map(x => ({
        count: _.toNumber(x[2]),
        price: _.toNumber(x[0]),
      })),
      ['price'],
      [isDesc ? 'desc' : 'asc'],
    );
    return ({
      currencyPair,
      platform: 'Cobinhood',
      highestSell: _.last(sortedSells),
      lowestBuy: _.first(sortedBuys),
    });
  });

const orderbookByCurrencyPairDataFromBinance = currencyPair => request
  .get(`https://www.binance.com/api/v1/depth?symbol=${currencyPair.split('-').join('')}`)
  .then((res) => {
    const { bids, asks } = res.body;
    const isDesc = true;
    const sortedBuys = _.orderBy(
      bids.map(x => ({
        count: _.toNumber(x[1]),
        price: _.toNumber(x[0]),
      })),
      ['price'],
      [isDesc ? 'desc' : 'asc'],
    );
    const sortedSells = _.orderBy(
      asks.map(x => ({
        count: _.toNumber(x[1]),
        price: _.toNumber(x[0]),
      })),
      ['price'],
      [isDesc ? 'desc' : 'asc'],
    );

    return ({
      currencyPair,
      platform: 'Binance',
      highestSell: _.last(sortedSells),
      lowestBuy: _.first(sortedBuys),
    });
  });


const ExchangeType = new GraphQLObjectType({
  name: 'ExchangeType',
  fields: {
    orderBookPairs: {
      type: GraphQLList(OrderBookPair),
      args: {
        currencyPairs: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
      },
      resolve: (parent, { currencyPairs }) => Promise.all(
        [
          ...currencyPairs.map(x => ({ platform: 'Cobinhood', currencyPair: x })),
          ...currencyPairs.map(x => ({ platform: 'Binance', currencyPair: x })),
        ]
          .map(currencyPair => (currencyPair.platform === 'Cobinhood'
            ? orderbookByCurrencyPairDataFromCobinhood(currencyPair.currencyPair)
            : orderbookByCurrencyPairDataFromBinance(currencyPair.currencyPair))),
      ),
    },
  },
});

module.exports = ExchangeType;
