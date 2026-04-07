import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchParagraph, fetchPromptByMode, fetchSentence } from './api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api helpers', () => {
  it('fetchSentence returns sentence text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sentence: 'abc' }),
      }),
    )

    await expect(fetchSentence('easy')).resolves.toBe('abc')
  })

  it('fetchParagraph returns paragraph text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ paragraph: 'long text' }),
      }),
    )

    await expect(fetchParagraph('hard')).resolves.toBe('long text')
  })

  it('fetchPromptByMode calls sentence endpoint logic for sentence mode', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sentence: 'sentence prompt' }),
      }),
    )

    await expect(fetchPromptByMode('sentence', 'medium')).resolves.toBe(
      'sentence prompt',
    )
  })

  it('throws when sentence request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    )

    await expect(fetchSentence('easy')).rejects.toThrow(
      'Could not fetch sentence',
    )
  })
})
