export const slidingWindowMax = (input: number[], k: number) => {
  const result: number[] = []
  const candidates: number[] = [] // data structure: monotonic decreasing queue / max queue

  for (let i = 0; i < input.length; i++) {
    const current = input[i]
    const start = i - k + 1

    // THE SECOND TIME WE EVER TOUCH AN INDEX IN THE ARRAY IS EITHER:
    // 1. when it's outside the current window (first while loop)
    // 2. when it's no longer relevant to us because it's smaller than the current value (second while loop)

    if (candidates.length && candidates.at(0) < start) {
      // we shift (remove from head of array) when value at index is outside window
      candidates.shift()
    }

    while (candidates.length && input[candidates.at(-1)] <= current) {
      // we pop (remove from tail of array) when value at index is smaller than the current value (meaning it is no longer a valid candidate)
      candidates.pop()
    }

    candidates.push(i) // THE FIRST PLACE WE ACCESS AN INDEX IN THE INPUT ARRAY: when we add it to the candidates array

    // each index is added ONCE and removed AT MOST ONCE from our candidates array (so, each element is touched at most TWICE)
    // rather than iterating over each K window per element, we keep a running list of max candidates (without needing to ever explicitly "sort" them) because we remove ineligible candidates as we iterate over the input array
    // that makes this solution O(n), not O(n * k)

    // because candidates are in decreasing order, head of array is current window max
    result.push(input[candidates[0]])
  }

  return result
}

// we can make use of a ring buffer to improve the above solution's space complexity (Uint16Array is a true contiguous array)
export const withRingBuffer = (input: number[], k: number) => {
  const result: number[] = []
  const candidates = new Uint32Array(k)

  let head = 0,
    tail = 0,
    size = 0 // we have to keep track of size because we cannot reliably use tail === head to check if the queue is empty (because that is also true when the queue is full)

  for (let i = 0; i < input.length; i++) {
    const start = i - k + 1

    if (size > 0 && candidates[head] < start) {
      // move head forward if it's outside the current window
      head = (head + 1) % k
      size--
    }

    while (size > 0) {
      const idx = (tail - 1 + k) % k
      const lastValue = input[candidates[idx]]
      if (lastValue > input[i]) break
      tail = idx
      size--
    }

    candidates[tail] = i
    tail = (tail + 1) % k
    size++

    // head is current window max
    result[i] = input[candidates[head]]
  }

  return result
}
