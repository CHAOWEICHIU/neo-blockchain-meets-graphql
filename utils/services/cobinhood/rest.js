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

const apiPost = ({ url, body }) => fetch(`${configMapping.cobinhood.endpoint}${url}`, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: cobinhoodApiKey,
  },
})
  .then(res => res.json())

const apiDelete = ({ url, body = '' }) => fetch(`${configMapping.cobinhood.endpoint}${url}`, {
  method: 'DELETE',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: cobinhoodApiKey,
  },
})
  .then(res => res.json())

module.exports = {
  apiGet,
  apiPost,
  apiDelete,
}
