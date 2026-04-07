import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
  const latestRequestRef = useRef(0)
  const switchKey = `${mode}-${difficulty}`

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
    const requestId = ++latestRequestRef.current
    setIsLoading(true)

    try {
      const newPrompt = await fetchPromptByMode(nextMode, nextDifficulty)

      if (requestId !== latestRequestRef.current) {
        return
      }

      setPromptText(newPrompt)
      setTypedText('')
      setIsCompleted(false)
      setIsReady(false)
      setStartTime(null)
      setElapsedSeconds(0)
    } finally {
      if (requestId === latestRequestRef.current) {
        setIsLoading(false)
      }
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
    <motion.main
      className="mx-auto flex min-h-screen w-full max-w-3xl flex-col p-4 sm:p-6"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        className="mb-6 flex items-center justify-end"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
      >
        <ThemeToggle />
      </motion.div>

      <motion.div
        className="space-y-6 flex-1"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.05 },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
          }}
        >
          <h2 className="text-2xl font-bold">Typing Speed Test</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Choose mode and difficulty, then type the prompt exactly as shown.</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
          }}
        >
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
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-end gap-2"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
          }}
        >
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
        </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`display-${switchKey}`}
              className="relative"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div
                className={[
                  'transition-opacity duration-300',
                  isLoading ? 'opacity-60' : 'opacity-100',
                ].join(' ')}
              >
                <SentenceDisplay sentence={promptText} typedText={typedText} />
              </div>
              <p
                className={[
                  'pointer-events-none absolute right-3 top-3 text-xs text-muted-foreground transition-opacity duration-300',
                  isLoading ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
                aria-live="polite"
              >
                Loading prompt...
              </p>
            </motion.div>
          </AnimatePresence>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
          }}
        >
          <StatsRow wpm={wpm} accuracy={accuracy} time={elapsedSeconds} />
        </motion.div>

        <motion.div
          className="space-y-2"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
          }}
        >
          <div className="flex items-center justify-between text-[11px] text-muted-foreground sm:text-xs">
            <span>Progress</span>
            <span>{completion.toFixed(0)}%</span>
          </div>
          <Progress value={completion} />
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`input-${switchKey}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Textarea
              ref={textareaRef}
              placeholder={isLoading ? 'Loading...' : 'Start typing here...'}
              value={typedText}
              onChange={(event) => handleTyping(event.target.value)}
              disabled={isLoading || isCompleted}
              className="h-32 min-h-32 resize-none overflow-y-auto text-sm transition-all"
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="flex justify-end gap-3"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
          }}
        >
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
        </motion.div>
      </motion.div>
    </motion.main>
  )
}
