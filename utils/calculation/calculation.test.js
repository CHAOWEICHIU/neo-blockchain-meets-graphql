const Big = require('big.js')
const {
  add,
  sub,
  mul,
  div,
} = require('./')

describe('calculation', () => {
  it('addition', () => {
    expect(add(1)).toBe('1')
    expect(add(0.1, 0.2)).toBe('0.3')
    expect(add(1, Big(2), 3, 4)).toBe('10')
    expect(add(0x10, 0x01)).toBe('17')

    expect(add('444444')).toBe('444444')
    expect(add('0.1', 0.2)).toBe('0.3')
    expect(add(1, '2', 3, Big('4'))).toBe('10')
    expect(add('2222222222', '5555555555')).toBe('7777777777')
    expect(add(1111111111, 2222222222)).toBe('3333333333')

    expect(add(1, -2, 3, -4)).toBe('-2')
    expect(add(100000000000000000, '-1')).toBe('99999999999999999')

    expect(add(0.1234567898765432, 0.8765432101234567)).toBe('0.9999999999999999')
  })

  it('substraction', () => {
    expect(sub(1)).toBe('1')
    expect(sub(3, 2, 1)).toBe('0')
    expect(sub('3333333333', Big(2222222222))).toBe('1111111111')
    expect(sub(3345678)).toBe('3345678')
    expect(sub(0x10, 0x01)).toBe('15')
    expect(sub(0, -1, -2, -3, -4, -5)).toBe('15')
    expect(sub(0.00102030405, Big('0.00102030404'))).toBe('0.00000000001')
  })

  it('multiply', () => {
    expect(mul(1)).toBe('1')
    expect(mul(3, 2, 1)).toBe('6')
    expect(mul(9, Big(8), 7, 6, 5, 0)).toBe('0')
    expect(mul('1', -2, 3, '-4', 5, -6)).toBe('-720')
    expect(mul('0.00000000001', Big('0.00000000001'))).toBe('0.0000000000000000000001')
    expect(mul(3345678, 10000001)).toBe('33456783345678')
  })

  it('divide', () => {
    expect(div(1)).toBe('1')
    expect(div(Big(242424242424242), 2)).toBe('121212121212121')
    expect(div(-720, '-6', 5, -4, '3', '-2', 1)).toBe('1')

    expect(div('0.000000001', Big('0.00000000000000000000000000001'))).toBe('100000000000000000000')

    // Devided by Zero should return undefined
    expect(div('3345678', 0)).toBeUndefined()
    expect(div(3345678, '0')).toBeUndefined()
    expect(div('144', 2, 3, 0)).toBeUndefined()
  })

  it('indivisible cases', () => {
    expect(mul(10, 1 / 3)).toBe('3.333333333333333') // Native JS returns 3.333333333333333'5'

    // use div to represent 1/3 gives you a better precision
    expect(mul(10, div(1, 3))).toBe('3.3333333333333333333')
    expect(div(10, 3)).toBe('3.33333333333333333333') // Native JS returns 3.333333333333333'5'
  })

  it('Extermely long number should be correct if it\'s provided as string (in native Number they will be incorrect)', () => {
    expect(add('0.123456789876543210', '0.876543210123456789')).toBe('0.999999999999999999')
    expect(add(0.123456789876543210, 0.876543210123456789)).not.toBe('0.999999999999999999')

    expect(sub('0.987654321987654321', '0.876543210876543210')).toBe('0.111111111111111111')
    expect(sub(0.987654321987654321, 0.876543210876543210)).not.toBe('0.111111111111111111')

    expect(mul('0.99999999999999999999', '0.99999999999999999999')).toBe('0.9999999999999999999800000000000000000001')
    expect(mul(0.99999999999999999999, 0.99999999999999999999)).toBe('1') // In native Number this will be 1!!

    // By default of Big.js, this is the smallest result for devision. Digit placed after 20 will be rounded.
    expect(div('0.0000000000000000001', '10')).toBe('0.00000000000000000001')
  })

  it('invalid arguments should return undefined', () => {
    const INVALID_ARGS = [
      [0.1, NaN], [0.1, Infinity], [0.1, {}], [[1, 2, 3]], ['0x10', '0x01'], [1, undefined, 3],
      [], ['pen', 'pineapple', 'apple', 'pen'], [948794, 'crazy'], [null, 1], [Symbol('3'), 3],
      [true, false],
    ]
    INVALID_ARGS.forEach(args => expect(add(...args)).toBeUndefined())
    INVALID_ARGS.forEach(args => expect(sub(...args)).toBeUndefined())
    INVALID_ARGS.forEach(args => expect(mul(...args)).toBeUndefined())
    INVALID_ARGS.forEach(args => expect(div(...args)).toBeUndefined())
  })
})
