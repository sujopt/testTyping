import { useEffect, useMemo, useRef, useState } from 'react'

import { ThemeToggle } from '@/components/theme-toggle'
import { SentenceDisplay } from '@/components/typing/SentenceDisplay'
import { StatsRow } from '@/components/typing/StatsRow'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  fetchPromptByMode,
  type DifficultyMode,
  type TypingMode,
} from '@/lib/api'
import { calculateAccuracy, calculateWpm } from '@/lib/metrics'

export function TypingTestPage() {
  const [promptText, setPromptText] = useState('')
  const [mode, setMode] = useState<TypingMode>('sentence')
  const [difficulty, setDifficulty] = useState<DifficultyMode>('medium')
  const [typedText, setTypedText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    void loadPrompt(mode, difficulty)
  }, [difficulty, mode])

  useEffect(() => {
    if (!isReady || !startTime || isCompleted) {
      return
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((Date.now() - startTime) / 1000)
    }, 100)

    return () => window.clearInterval(timer)
  }, [isCompleted, isReady, startTime])

  async function loadPrompt(nextMode: TypingMode, nextDifficulty: DifficultyMode) {
    setIsLoading(true)
    try {
      const newPrompt = await fetchPromptByMode(nextMode, nextDifficulty)
      setPromptText(newPrompt)
      setTypedText('')
      setIsCompleted(false)
      setIsReady(false)
      setStartTime(null)
      setElapsedSeconds(0)
    } finally {
      setIsLoading(false)
    }
  }

  function handleTyping(nextText: string) {
    if (isCompleted) {
      return
    }

    // Auto-start on first character
    if (!isReady && nextText.length > 0) {
      setIsReady(true)
    }

    if (!startTime && nextText.length > 0) {
      setStartTime(Date.now())
    }

    const cappedText = nextText.slice(0, promptText.length)
    setTypedText(cappedText)

    if (cappedText === promptText) {
      setIsCompleted(true)
      if (startTime) {
        setElapsedSeconds((Date.now() - startTime) / 1000)
      }
    }
  }

  const accuracy = useMemo(
    () => calculateAccuracy(promptText, typedText),
    [promptText, typedText],
  )

  const wpm = useMemo(
    () => calculateWpm(typedText.length, elapsedSeconds),
    [typedText.length, elapsedSeconds],
  )

  const completion = promptText.length
    ? (typedText.length / promptText.length) * 100
    : 0

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-end">
        <ThemeToggle />
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h2 className="text-2xl font-bold">Typing Speed Test</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Choose mode and difficulty, then type the prompt exactly as shown.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={mode === 'sentence' ? 'default' : 'outline'}
            onClick={() => setMode('sentence')}
          >
            Sentence Mode
          </Button>
          <Button
            size="sm"
            variant={mode === 'paragraph' ? 'default' : 'outline'}
            onClick={() => setMode('paragraph')}
          >
            Paragraph Mode
          </Button>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            size="sm"
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </Button>
          <Button
            size="sm"
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </Button>
        </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading prompt...</p>
          ) : (
            <SentenceDisplay sentence={promptText} typedText={typedText} />
          )}

          <StatsRow wpm={wpm} accuracy={accuracy} time={elapsedSeconds} />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground sm:text-xs">
              <span>Progress</span>
              <span>{completion.toFixed(0)}%</span>
            </div>
            <Progress value={completion} />
          </div>

          <Textarea
            ref={textareaRef}
            placeholder={isLoading ? 'Loading...' : 'Start typing here...'}
            value={typedText}
            onChange={(event) => handleTyping(event.target.value)}
            disabled={isLoading || isCompleted}
            className="h-32 min-h-32 resize-none overflow-y-auto text-sm transition-all"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => void loadPrompt(mode, difficulty)}
            >
              Restart Test
            </Button>
            {isCompleted && (
              <Button className="w-fit" onClick={() => {
                setTypedText('')
                setIsCompleted(false)
                setIsReady(false)
                setStartTime(null)
                setElapsedSeconds(0)
              }}>
                Try Again Same Sentence
              </Button>
            )}
          </div>
      </div>
    </main>
  )
}
