import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface SentenceDisplayProps {
  sentence: string
  typedText: string
}

export function SentenceDisplay({ sentence, typedText }: SentenceDisplayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeCharRef = useRef<HTMLSpanElement | null>(null)
  const currentTypedIndex = typedText.length > 0 ? typedText.length - 1 : -1

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (typedText.length === 0) {
      containerRef.current.scrollTo({ top: 0, left: 0 })
      return
    }

    activeCharRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [sentence, typedText])

  return (
    <div
      ref={containerRef}
      className="h-32 overflow-y-auto rounded-lg border bg-muted/40 p-3 text-left text-sm leading-relaxed sm:h-36 sm:text-base"
    >
      {sentence.split('').map((char, index) => {
        const typedChar = typedText[index]
        const isTyped = typedChar !== undefined
        const isCorrect = isTyped && typedChar === char

        return (
          <span
            key={`${char}-${index}`}
            ref={index === currentTypedIndex ? activeCharRef : null}
            className={cn(
              'transition-colors',
              !isTyped && 'text-foreground/80',
              isCorrect && 'font-semibold text-emerald-700 dark:text-emerald-300',
              isTyped && !isCorrect && 'font-semibold text-rose-700 dark:text-rose-300',
            )}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}
