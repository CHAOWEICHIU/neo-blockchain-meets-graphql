const Big = require('big.js')

const RM = {
  ROUND_DOWN: 0,
  ROUND_HALF_UP: 1,
  ROUND_HALF_EVEN: 2,
  ROUND_UP: 3,
}

const catchWrapper = fn => ((...args) => {
  try {
    return fn(...args).toFixed()
  } catch (e) {
    return undefined
  }
})

const OperationGenerator = op => (
  (...args) => (
    args.reduce(
      (sum, val) => (sum ? sum[op](val) : Big(val)),
      undefined,
    )
  )
)

const add = catchWrapper(OperationGenerator('plus'))
const sub = catchWrapper(OperationGenerator('minus'))
const mul = catchWrapper(OperationGenerator('times'))
const div = catchWrapper(OperationGenerator('div'))

const round = catchWrapper((num, precision = 10, type = RM.ROUND_DOWN) => (
  Big(num).round(precision, type)
))

module.exports = {
  add,
  sub,
  mul,
  div,
  round,
}
