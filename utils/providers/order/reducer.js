const { fromJS } = require('immutable')
const {
  RECEIVED_ORDERS,
  RECEIVED_ORDER,
} = require('./constants')

const initialState = fromJS({
  orders: [],
})

const orderProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_ORDERS:
      return state.setIn(['orders'], fromJS(action.payload))
    case RECEIVED_ORDER: {
      const orderIndex = state.get('orders').findIndex(x => x.get('id') === action.payload.id)
      if (orderIndex !== -1) {
        const newState = state.setIn(['orders', orderIndex], fromJS(action.payload))
        return newState
      }
      return state
    }
    default:
      return state
  }
}

module.exports = orderProviderReducer
