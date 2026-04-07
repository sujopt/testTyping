export function calculateWpm(totalChars: number, seconds: number): number {
  if (seconds <= 0) {
    return 0
  }

  const minutes = seconds / 60
  return (totalChars / 5) / minutes
}

export function calculateAccuracy(sentence: string, typedText: string): number {
  if (typedText.length === 0) {
    return 100
  }

  let correctChars = 0
  for (let index = 0; index < typedText.length; index += 1) {
    if (typedText[index] === sentence[index]) {
      correctChars += 1
    }
  }

  return (correctChars / typedText.length) * 100
}
