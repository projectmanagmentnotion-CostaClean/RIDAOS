import type { ElementType, ReactNode } from 'react'
import { splitTextLines, splitTextWords, wordHasSticker } from '../lib/textMotion'

type AnimatedTextProps = {
  as?: ElementType
  text?: string
  lines?: string[]
  className?: string
  motion?: string
  misprint?: boolean
  stickerWords?: string[]
  children?: ReactNode
}

function AnimatedText({
  as,
  text,
  lines,
  className,
  motion,
  misprint = false,
  stickerWords = [],
  children,
}: AnimatedTextProps) {
  const Tag = (as ?? 'div') as ElementType
  const resolvedLines = splitTextLines(text, lines)

  const content = children ?? resolvedLines.map((line, lineIndex) => (
    <span className="text-line" key={`${line}-${lineIndex}`}>
      {splitTextWords(line).map((word, wordIndex) => (
        <span
          className={`text-word${wordHasSticker(word, stickerWords) ? ' is-sticker' : ''}`}
          key={`${word}-${wordIndex}`}
        >
          {word}
        </span>
      ))}
    </span>
  ))

  if (!misprint) {
    return (
      <Tag
        className={className}
        data-animate-heading
        data-motion={motion}
      >
        {content}
      </Tag>
    )
  }

  return (
    <div className="misprint-stack" data-motion={motion}>
      <div aria-hidden="true" className={`misprint-layer misprint-layer-outline${className ? ` ${className}` : ''}`}>
        {content}
      </div>
      <div aria-hidden="true" className={`misprint-layer misprint-layer-offset${className ? ` ${className}` : ''}`}>
        {content}
      </div>
      <Tag className={`misprint-layer misprint-layer-main${className ? ` ${className}` : ''}`} data-animate-heading>
        {content}
      </Tag>
    </div>
  )
}

export default AnimatedText
