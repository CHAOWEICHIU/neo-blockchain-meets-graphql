/* eslint-disable */
const { processLimitOrderFromWebSocket } = require('./utils')

describe('processLimitOrderFromWebSocket', () => {
  const responseFromWebSocket = [
    "ed679c62-bd0e-40ea-bf04-40e3b046c944",
    "1513555200000",
    "1513555200000",
    "COB-ETH",
    "open",
    "opened",
    "ask",
    "0.01",
    "0.0",
    "1000",
    "0.0",
    "exchange",
  ]

  it('will return the data structure', () => {
    expect(processLimitOrderFromWebSocket(responseFromWebSocket)).toEqual({
      id: responseFromWebSocket[0],
      trading_pair_id: responseFromWebSocket[3],
      side: responseFromWebSocket[6],
      type: 'limit',
      price: responseFromWebSocket[7],
      size: responseFromWebSocket[9],
      filled: responseFromWebSocket[10],
      state: responseFromWebSocket[4],
      timestamp: responseFromWebSocket[1],
      eq_price: responseFromWebSocket[8],
      completed_at: responseFromWebSocket[2],
      source: 'exchange',
    })
  })
})
