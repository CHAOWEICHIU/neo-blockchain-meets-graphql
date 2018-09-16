const fetch = require('node-fetch')
const { configMapping } = require('../constants')
const { cobinhoodApiKey } = require('../../../env')

const apiGet = ({ url }) => fetch(`${configMapping.cobinhood.endpoint}${url}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: cobinhoodApiKey,
  },
}).then(res => res.json())

module.exports = {
  apiGet,
}
