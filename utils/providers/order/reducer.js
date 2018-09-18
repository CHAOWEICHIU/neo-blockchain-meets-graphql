const { fromJS } = require('immutable')
const {
  RECEIVED_ORDERS,
} = require('./constants')

const initialState = fromJS({
  orders: [],
})

const orderProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_ORDERS:
      return state.set('orders', action.payload)
    default:
      return state
  }
}

module.exports = orderProviderReducer
