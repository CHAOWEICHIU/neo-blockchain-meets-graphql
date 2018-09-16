const { toUpper } = require('lodash')
const { apiGet } = require('./rest')

const getRates = ({ currencyId }) => apiGet({
  url: `/v1/market/exchange_rates/${toUpper(currencyId)}`,
})

module.exports = {
  getRates,
}
