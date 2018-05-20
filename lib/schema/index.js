const graphql = require('graphql')
const request = require('superagent')
const _ = require('lodash')
const moment = require('moment')
const Neon = require('@cityofzion/neon-js')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} = graphql

/**
 * fetch coin market cap id base on given symbol
 * @param {array} [{ symbol: 'ONT', symbol: 'QQQ' }]
 * @return {array} [{ symbol: 'ONT', id: 2566 }, { symbol: 'QQQ', id: null }]
 */
const fetchCmcListingIdsBySymbols = (symbols) => 
request
.get('https://api.coinmarketcap.com/v2/listings/')
.then(({body: { data }}) => 
  symbols.map(x => {
    let result = _.find(data, x)
    return Object.assign({}, x ,{ id: result ? result.id : null })
  })
)

/**
 * fetch coin market cap usd prices
 * @param {array} [{ symbol: 'ONT', symbol: 'QQQ' }]
 * @return {array} [{ symbol: 'ONT', id: 2566, USD: 7.333 }, { symbol: 'QQQ', id: null, USD: null }]
 */
const fetchCmcDataBySymbols = symbols => 
  fetchCmcListingIdsBySymbols(symbols)
  .then(symbols => 
    Promise.all(
      symbols.map(symbol => 
        symbol.id
          ? request.get(`https://api.coinmarketcap.com/v2/ticker/${symbol.id}/`)
          : { body: { data: null } }
      )
    )
    .then(data => data.map(d => d.body.data))
    .then(data =>
      symbols.map((symbol, symbolIndex) =>
        Object.assign(
          {},
          symbol,
          { USD: data[symbolIndex] ? data[symbolIndex].quotes.USD.price : null })
        )
    )
  )


const bestRPCEndpoint = 'http://seed3.bridgeprotocol.io:10332'

const getNativeAssetsFunction = (address, net) =>
  Neon
  .api
  .default
  .get.balance(
    net,
    address
  )
  .then(({ assets: { GAS, NEO } }) => [
    {
      balance: NEO.balance,
      name: 'NEO',
    },
    {
      balance: GAS.balance,
      name: 'GAS',
    }
  ])

const getNep5TokensThatHasBalance = address => {
  return new Promise((resolve) => {
    request
    .get('https://raw.githubusercontent.com/CityOfZion/neo-tokens/master/tokenList.json')
    .then(res =>
      _.flatMap(_.toPairsIn(JSON.parse(res.text)))
      .filter(x => _.isObject(x))
      .map(x => x.networks['1'].hash)
    )
    .then(scriptHashes => {
      return Promise.all(
        scriptHashes.map(scriptHash =>
          Neon.api.nep5.getTokenInfo('http://seed7.bridgeprotocol.io:10332', scriptHash)
        )
      )
      .then(nep5Tokens => {
        return nep5Tokens.map((nep5Token, nep5TokenIndex) =>
          Object.assign({}, nep5Token, { scriptHash: scriptHashes[nep5TokenIndex] })
        )
      })
      .then(nep5Tokens => {
        return Promise.all(
          nep5Tokens.map(nep5Token =>
            Neon
            .api
            .nep5
            .getTokenBalance('http://seed7.bridgeprotocol.io:10332', nep5Token.scriptHash, address)
            .then(balance =>
              Object.assign(
                {},
                nep5Token,
                { balance },
              )
            )
          )
        )
      })
      .then(nep5Tokens => nep5Tokens.filter(nep5Token => nep5Token.balance !== 0))
      .then(nep5Tokens => resolve(nep5Tokens))
    })
  })
}

const WalletType = new GraphQLObjectType({
  name: 'WalletType',
  fields: {
    privateKey: { type: GraphQLString },
    WIF: { type: GraphQLString },
    publicKey: { type: GraphQLString },
    scriptHash: { type: GraphQLString },
    address: { type: GraphQLString },
  },
})

const AssetSummaryType = new GraphQLObjectType({
  name: 'AssetSummaryType',
  description: 'will give out price base on token',
  fields: { cmcUsdPrice: { type: GraphQLFloat } },
})

const AssetNameAmountType = new GraphQLObjectType({
  name: 'AssetNameAmountType',
  description: 'Asset Name/Amount Type',
  fields: {
    balance: { type: GraphQLFloat },
    name: { type: GraphQLString },
    assetSummary: {
      type: AssetSummaryType,
      resolve: parent =>
        fetchCmcDataBySymbols([{ symbol: parent.name }])
          .then(data =>({ cmcUsdPrice: data[0].USD })  )
    },
  },
})

const Nep5AssetInformationType = new GraphQLObjectType({
  name: 'Nep5AssetInformationType',
  description: 'NEP5 token is made with NEO smart contract',
  fields: {
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
    decimals: { type: GraphQLInt },
    totalSupply: { type: GraphQLFloat },
    scriptHash: { type: GraphQLString },
  },
})


const Nep5AssetType = new GraphQLObjectType({
  name: 'Nep5AssetType',
  description: 'Asset Name/Amount Type',
  fields: {
    balance: { type: GraphQLFloat },
    name: { type: GraphQLString },
    tokenInformation: { type: Nep5AssetInformationType },
    assetSummary: {
      type: AssetSummaryType,
      resolve: parent =>
        fetchCmcDataBySymbols([{ symbol: parent.symbol }])
          .then(data =>({ cmcUsdPrice: data[0].USD })  )
    },
  }
})


const AssetType = new GraphQLObjectType({
  name: 'AssetType',
  description: 'Neo has two kinds assets. Onc being the native token(NEO/GAS), and the other is called NEP5 token which is generated with smart contract',
  fields: {
    nativeAssets: {
      type: GraphQLList(AssetNameAmountType),
      resolve: ({ addresses, net }) =>
        Promise.all(
          addresses.map(address => getNativeAssetsFunction(address, net))
        )
        .then(data =>
          _.flattenDeep(data)
          .reduce((container, item) =>
            container.map(x => x.name === item.name
              ? Object.assign({},x,{ balance: _.toNumber(x.balance) + _.toNumber(item.balance) })
              : x
          ), [{ name: 'GAS', balance: 0 }, { name: 'NEO', balance: 0 }])
        )
        ,
    },
    nep5Assets: {
      type: GraphQLList(Nep5AssetType),
      resolve: parent => 
        Promise.all(
          parent.addresses.map(address => getNep5TokensThatHasBalance(address))
        )
        .then(data => 
          _.flatMapDeep(data)
          .reduce((container, item) => {
            const targetIndex = _.findIndex(container, x => x.name === item.name)
            if(targetIndex !== -1){
              container[targetIndex].balance = container[targetIndex].balance + item.balance
            } else {
              container.push(item)
            }
            return container
          }, [])
        )
        .then(nep5Tokens => 
          nep5Tokens.map(nep5Token =>
            Object.assign({}, nep5Token, { tokenInformation: nep5Token })
          )
        )
    },
  },
})


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    assets: {
      type: AssetType,
      args: {
        addresses: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
        net: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { addresses, net }) => ({
        addresses,
        net,
      })
      ,
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createWallet: {
      type: WalletType,
      resolve: () => {
        const privateKey = Neon.wallet.default.create.privateKey()
        const account = Neon.default.create.account(privateKey)
        return ({
          privateKey: account.privateKey,
          publicKey: account.publicKey,
          scriptHash: account.scriptHash,
          address: account.address,
          WIF: account.WIF,
        })
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})

