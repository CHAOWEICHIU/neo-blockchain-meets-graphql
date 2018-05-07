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


const nep5TokenScriptHashes = [
  'ceab719b8baa2310f232ee0d277c061704541cfb',
  '0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5',
  'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
  '132947096727c84c7f9e076c90f08fec3bc17f18',
]

const Nep5TokenType = new GraphQLObjectType({
  name: 'Nep5TokenType',
  fields: {
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
    decimals: { type: GraphQLInt },
    totalSupply: { type: GraphQLFloat },
    scriptHash: { type: GraphQLString },
  },
})

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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cool: {
      type: WalletType,
      resolve: () => '' ,
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

