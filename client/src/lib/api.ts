const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'http://localhost:4000'

interface SentenceResponse {
  sentence: string
}

interface ParagraphResponse {
  paragraph: string
}

export type TypingMode = 'sentence' | 'paragraph'
export type DifficultyMode = 'easy' | 'medium' | 'hard'

export async function fetchSentence(difficulty: DifficultyMode): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/sentence?difficulty=${difficulty}`,
  )

  if (!response.ok) {
    throw new Error('Could not fetch sentence')
  }

  const data = (await response.json()) as SentenceResponse
  return data.sentence
}

export async function fetchParagraph(difficulty: DifficultyMode): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/paragraph?difficulty=${difficulty}`,
  )

  if (!response.ok) {
    throw new Error('Could not fetch paragraph')
  }

  const data = (await response.json()) as ParagraphResponse
  return data.paragraph
}

export async function fetchPromptByMode(
  mode: TypingMode,
  difficulty: DifficultyMode,
): Promise<string> {
  if (mode === 'paragraph') {
    return fetchParagraph(difficulty)
  }

  return fetchSentence(difficulty)
}
