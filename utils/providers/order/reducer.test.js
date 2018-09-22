const { fromJS } = require('immutable')
const orderProviderReducer = require('./reducer')
const { receivedOrder, receivedOrders } = require('./actions')
const { processLimitOrderFromWebSocket } = require('../order/utils')

const socketData = [
  'ed679c62-bd0e-40ea-bf04-40e3b046c944',
  '1513555200000',
  '1513555200000',
  'COB-ETH',
  'open',
  'opened',
  'ask',
  '0.01',
  '0.0',
  '1000',
  '0.0',
  'exchange',
]

const apiData = [
  {
    id: 'cc69f653-0d33-47f2-9094-68ea62ec3601',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537404887168,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '175d934e-044f-43b7-81a3-e6026bb0e81b',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537404758584,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: 'b858abba-e432-4699-8843-d03a5a44cb58',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537404602481,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: 'bd7efba4-322c-492d-94f6-05926ae6ca91',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537403753871,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '772cb88e-0500-4908-9577-d12546a891cb',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537403636085,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '74c9cb7c-a10a-4ba4-812a-12331735116c',
    trading_pair_id: 'BTC-USDT',
    side: 'bid',
    type: 'limit',
    price: '6314.3',
    size: '0.5',
    filled: '0',
    state: 'open',
    timestamp: 1537403486876,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '073fff1c-7a9a-4ada-a7be-a5ed8a0573c2',
    trading_pair_id: 'COB-ETH',
    side: 'bid',
    type: 'limit',
    price: '0.3',
    size: '1000',
    filled: '0',
    state: 'open',
    timestamp: 1536995343597,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: 'c932f04f-ac24-4c5c-8148-67c6f1a6e2a2',
    trading_pair_id: 'COB-ETH',
    side: 'bid',
    type: 'limit',
    price: '0.3',
    size: '1000',
    filled: '0',
    state: 'open',
    timestamp: 1536994982792,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '840fb43d-4935-4c4d-b0e0-fa986b879b4d',
    trading_pair_id: 'COB-ETH',
    side: 'bid',
    type: 'limit',
    price: '0.3',
    size: '1000',
    filled: '0',
    state: 'open',
    timestamp: 1536974951866,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
  {
    id: '77973d6a-5302-4ed1-bc62-f6a2e55a77ca',
    trading_pair_id: 'COB-ETH',
    side: 'bid',
    type: 'limit',
    price: '0.5',
    size: '1000',
    filled: '0',
    state: 'open',
    timestamp: 1536974701671,
    eq_price: '0',
    completed_at: null,
    source: 'exchange',
  },
]

const initialState = fromJS({
  orders: [],
})


describe('orderProviderReducer', () => {
  const initStateFromReducer = orderProviderReducer(initialState, { type: 'INIT' })
  const addedOrdersStateFromReducer = orderProviderReducer(initStateFromReducer, receivedOrders(apiData))
  it('init state', () => {
    expect(initStateFromReducer).toEqual(initialState)
  })
  it('Add orders', () => {
    expect(addedOrdersStateFromReducer.get('orders')).toEqual(fromJS(apiData))
  })
  it('will not duplicate orders, will be in sorted order', () => {
    const data = Object.assign(
      {},
      apiData[0],
      { size: '0.3' },
    )
    const modifiedApiData = [
      data,
      ...apiData.slice(1, apiData.length + 1)
    ]
    expect(
      orderProviderReducer(addedOrdersStateFromReducer, receivedOrder(data)).get('orders')
    ).toEqual(
      fromJS(modifiedApiData)
    )
  })
  xit('remove particular order if it is filled', () => {})
})
