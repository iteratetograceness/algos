import { describe, expect, it } from 'bun:test'
import { slidingWindowMax } from './sliding-window-max'

const cases = [
  {
    input: [5, 3, 4, 2],
    k: 3,
    expected: [5, 5, 5, 4],
  },
  {
    input: [7, 4, 12, 6, 0, 54],
    k: 3,
    expected: [7, 7, 12, 12, 12, 54],
  },
  {
    input: [1, 2, 1, 1, 7, 1, 10, 3, 77, 1, 2],
    k: 2,
    expected: [1, 2, 2, 1, 7, 7, 10, 10, 77, 77, 2],
  },
]

describe('sliding window max', () => {
  cases.forEach(({ input, k, expected }) => {
    it(`${input} with k = ${k}`, () => {
      const result = slidingWindowMax(input, k)
      expect(result).toEqual(expected)
    })
  })

  it('single window', () => {
    const input = [5]
    const k = 1
    const result = slidingWindowMax(input, k)
    expect(result).toEqual([5])
  })

  it('empty input', () => {
    expect(slidingWindowMax([], 3)).toEqual([])
  })

  it('k > input.length', () => {
    expect(slidingWindowMax([1, 2, 3], 5)).toEqual([1, 2, 3])
  })

  it('k = input.length', () => {
    expect(slidingWindowMax([2, 1, 3], 3)).toEqual([2, 2, 3])
  })

  it('all elements equal', () => {
    expect(slidingWindowMax([7, 7, 7, 7], 2)).toEqual([7, 7, 7, 7])
  })

  it('strictly increasing input', () => {
    expect(slidingWindowMax([1, 2, 3, 4], 2)).toEqual([1, 2, 3, 4])
  })

  it('strictly decreasing input', () => {
    expect(slidingWindowMax([4, 3, 2, 1], 2)).toEqual([4, 4, 3, 2])
  })

  it('negative numbers', () => {
    expect(slidingWindowMax([-1, -3, -2, -5], 2)).toEqual([-1, -1, -2, -2])
  })

  it('k = 1 (window size 1)', () => {
    expect(slidingWindowMax([9, 8, 7, 6], 1)).toEqual([9, 8, 7, 6])
  })

  it('large window', () => {
    const input = Array.from({ length: 3000 }, (_, i) => i)
    const k = 1000
    const result = slidingWindowMax(input, k)
    expect(result).toEqual(input)
  })
})
