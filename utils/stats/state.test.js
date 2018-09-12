/* eslint-disable */
const { bollingerBands } = require('./')

describe('bollingerBands', () => {
  const prices = [90.70, 92.90, 92.98, 91.80, 92.66, 92.68, 92.30, 92.77, 92.54, 92.95, 93.20, 91.07, 89.83, 89.74, 90.40, 90.74, 88.02, 88.09, 88.84, 90.78, 90.54]
  it('will return corresponding number', () => {
    const { middleBand, upperBand, lowerBand } = bollingerBands(prices)
    expect(middleBand).toBe(91.21571428571427)
    expect(upperBand).toBe(94.43356077901096)
    expect(lowerBand).toBe(87.99786779241758)
  })
})
