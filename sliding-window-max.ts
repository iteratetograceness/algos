export const slidingWindowMax = (input: number[], k: number) => {
  const result: number[] = []
  const candidates: number[] = [] // data structure: monotonic decreasing queue / max queue

  for (let i = 0; i < input.length; i++) {
    const current = input[i]
    const start = i - k + 1

    // remove candidates outside current window
    while (candidates.length > 0 && candidates[0]! < start) {
      candidates.shift()
    }

    // remove candidates smaller than/equal to current value
    while (
      candidates.length > 0 &&
      input[candidates[candidates.length - 1]] <= current
    ) {
      candidates.pop()
    }

    // add index to potential future max candidates
    candidates.push(i)

    // because we've sorted candidates in decreasing order, head of array is current window max
    result.push(input[candidates[0]])
  }

  return result
}
