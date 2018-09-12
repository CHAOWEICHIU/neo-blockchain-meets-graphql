const _ = require('lodash')

const average = numbers => _.sum(numbers) / numbers.length

const stdev = arr => Math.sqrt(_.sum(_.map(arr, i => (i - average(arr)) ** 2)) / arr.length)


const bollingerBands = (numbers) => {
  const movingAverage = average(numbers)
  const standardDeviation = stdev(numbers)

  return ({
    middleBand: movingAverage,
    upperBand: movingAverage + standardDeviation * 2,
    lowerBand: movingAverage - standardDeviation * 2,
  })
}

module.exports = {
  bollingerBands,
}
