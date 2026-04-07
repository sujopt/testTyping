import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchParagraph, fetchPromptByMode, fetchSentence } from './api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api helpers', () => {
  it('fetchSentence returns prompt text from selected difficulty', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    await expect(fetchSentence('easy')).resolves.toBe(
      'The quick brown fox jumps over the lazy dog.',
    )
  })

  it('fetchParagraph returns prompt text from selected difficulty', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    await expect(fetchParagraph('hard')).resolves.toBe(
      'Complex systems fail in subtle ways when observability is treated as an afterthought. Instrumentation, structured logs, and actionable alerts transform unknown failures into diagnosable events, allowing teams to recover faster and make decisions rooted in evidence rather than intuition.',
    )
  })

  it('fetchPromptByMode uses sentence pool for sentence mode', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    await expect(fetchPromptByMode('sentence', 'medium')).resolves.toBe(
      'Consistency beats intensity when learning a new skill.',
    )
  })

  it('falls back to medium difficulty for invalid values', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    await expect(fetchSentence('invalid' as unknown as 'easy')).resolves.toBe(
      'Consistency beats intensity when learning a new skill.',
    )
  })
})
