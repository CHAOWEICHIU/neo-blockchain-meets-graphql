/* eslint-disable */
const UserExchange = require('./')

const user = new UserExchange({
  platform: 'cobinhood',
  apiKey: 'qq',
})

describe('User Exchange', () => {
  it('will have methods', () => {
    expect(user.placeOrder).toBeDefined()
    expect(user.getOrders).toBeDefined()
    expect(user.cancelAllOrders).toBeDefined()
    expect(user.cancelOrder).toBeDefined()
  })
})
