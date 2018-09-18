const { range, flatten } = require('lodash')
const { getOpenOrders } = require('../../services/cobinhood/index')
const { receivedOrders } = require('./actions')
const { store } = require('../index')

const limit = 100

getOpenOrders({ limit })
  .then((res) => {
    Promise.all(
      range(1, res.result.total_page + 1)
        .map(page => getOpenOrders({ limit, page })),
    )
      .then(responses => flatten(responses.map(response => response.result.orders)))
      .then((orders) => {
        store.dispatch(receivedOrders(orders))
      })
  })
