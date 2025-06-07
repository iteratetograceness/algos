export const slidingWindowMax = (input: number[], k: number) => {
  const result: number[] = []
  let lastMaxIdx: number | undefined

  for (let i = 0; i < input.length; i++) {
    // prev max is outside current window
    // find new valid max within current window
    if (lastMaxIdx !== undefined && lastMaxIdx <= i - k) {
      let newMaxIdx = i - k + 1

      for (let j = newMaxIdx; j <= i; j++) {
        if (input[j]! >= input[newMaxIdx]!) {
          newMaxIdx = j
        }
      }

      result[i] = input[newMaxIdx]!
      lastMaxIdx = newMaxIdx
    } // found new max within current window
    else if (lastMaxIdx === undefined || input[i]! >= input[lastMaxIdx]!) {
      lastMaxIdx = i
      result[i] = input[i]!
    } // prev max is inside current window and still valid
    else {
      result[i] = input[lastMaxIdx]!
    }
  }

  return result
}
