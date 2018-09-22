const fetch = require('node-fetch')
const {
  COBINHOOD_API_ENDPOINT,
} = require('../../../config')
const { COBINHOOD_API_KEY } = require('../../../env')

const apiGet = ({ url }) => fetch(`${COBINHOOD_API_ENDPOINT}${url}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: COBINHOOD_API_KEY,
  },
}).then(res => res.json())

const apiPost = ({ url, body }) => fetch(`${COBINHOOD_API_ENDPOINT}${url}`, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: COBINHOOD_API_KEY,
  },
})
  .then(res => res.json())

const apiDelete = ({ url, body = '' }) => fetch(`${COBINHOOD_API_ENDPOINT}${url}`, {
  method: 'DELETE',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    nonce: Date.now(),
    authorization: COBINHOOD_API_KEY,
  },
})
  .then(res => res.json())

module.exports = {
  apiGet,
  apiPost,
  apiDelete,
}
