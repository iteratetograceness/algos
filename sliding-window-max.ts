export const slidingWindowMax = (input: number[], k: number) => {
  const result: number[] = []
  const candidates: number[] = [] // data structure: monotonic decreasing queue / max queue

  for (let i = 0; i < input.length; i++) {
    const current = input[i]
    const start = i - k + 1

    // THE SECOND TIME WE EVER TOUCH AN INDEX IN THE ARRAY IS EITHER:
    // 1. when it's outside the current window (first while loop)
    // 2. when it's no longer relevant to us because it's smaller than the current value (second while loop)

    while (candidates.length > 0 && candidates[0]! < start) {
      // we shift (remove from head of array) when value at index is outside window
      candidates.shift()
    }

    while (
      candidates.length > 0 &&
      input[candidates[candidates.length - 1]] <= current
    ) {
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
