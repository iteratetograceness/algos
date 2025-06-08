import { describe, expect, it } from 'bun:test'
import { slidingWindowMax, withRingBuffer } from './sliding-window-max'

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
  {
    input: [
      1, 3, 2, 5, 8, 6, 7, 4, 9, 10, 12, 11, 13, 15, 14, 16, 18, 17, 19, 20,
    ],
    k: 13,
    expected: [
      1, 3, 3, 5, 8, 8, 8, 8, 9, 10, 12, 12, 13, 15, 15, 16, 18, 18, 19, 20,
    ],
  },
  {
    input: [
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, 15,
      23, 11, 8, 14, 6, 70, 11, 66, 67, 12, 1, -4, 23, 9, 12, 11, 10, -5, 5, 4,
      7,
    ],
    k: 20,
    expected: [
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 15, 23, 23, 23, 23, 23, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
      70, 70, 70, 70, 70, 70,
    ],
  },
  {
    input: [
      100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83,
      82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65,
      64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51,
    ],
    k: 25,
    expected: [
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 98, 97, 96, 95, 94,
      93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76,
      75,
    ],
  },
  {
    input: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
    ],
    k: 10,
    expected: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 23, 22, 21, 20,
      19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9,
    ],
  },
  {
    input: [
      1000, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
      38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    ],
    k: 50,
    expected: [
      1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
      1000, 1000,
    ],
  },
  {
    input: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      100,
    ],
    k: 50,
    expected: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      100,
    ],
  },
]

describe('sliding window max', () => {
  cases.forEach(({ input, k, expected }) => {
    it(`array of size ${input.length} with k = ${k}`, () => {
      const result = slidingWindowMax(input, k) //
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

describe('sliding window max (ring buffer)', () => {
  cases.forEach(({ input, k, expected }) => {
    it(`array of size ${input.length} with k = ${k}`, () => {
      const result = withRingBuffer(input, k) //
      expect(result).toEqual(expected)
    })
  })
})
