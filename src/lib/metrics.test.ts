import { describe, expect, it } from 'vitest'

import { calculateAccuracy, calculateWpm } from './metrics'

describe('calculateWpm', () => {
  it('returns 0 when seconds is zero', () => {
    expect(calculateWpm(100, 0)).toBe(0)
  })

  it('calculates words per minute using 5 chars per word', () => {
    // 250 chars in 60 seconds = (250 / 5) / 1 = 50 WPM
    expect(calculateWpm(250, 60)).toBe(50)
  })
})

describe('calculateAccuracy', () => {
  it('returns 100 when no text has been typed', () => {
    expect(calculateAccuracy('hello', '')).toBe(100)
  })

  it('returns full accuracy when all characters match', () => {
    expect(calculateAccuracy('hello', 'hello')).toBe(100)
  })

  it('returns partial accuracy when some characters differ', () => {
    expect(calculateAccuracy('hello', 'hxllo')).toBe(80)
  })
})
