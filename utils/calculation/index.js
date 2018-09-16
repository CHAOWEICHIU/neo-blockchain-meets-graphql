const Big = require('big.js')

const wrapper = fn => ((...args) => {
  try {
    const bigs = args.map(it => Big(it))
    return fn(bigs).toFixed()
  } catch (e) {
    return undefined
  }
})

const add = wrapper(bigs => (
  bigs.reduce((sum, val) => (
    sum ? sum.plus(val) : val
  ), undefined)))

const sub = wrapper(bigs => (
  bigs.reduce((sum, val) => (
    sum ? sum.minus(val) : val
  ), undefined)))

const mul = wrapper(bigs => (
  bigs.reduce((sum, val) => (
    sum ? sum.times(val) : val
  ), undefined)))

const div = wrapper(bigs => (
  bigs.reduce((sum, val) => (
    sum ? sum.div(val) : val
  ), undefined)))

module.exports = {
  add,
  sub,
  mul,
  div,
}
