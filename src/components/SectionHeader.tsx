import AnimatedText from './AnimatedText'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
  hero?: boolean
  titleLines?: string[]
  stickerWords?: string[]
}

function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  hero = false,
  titleLines,
  stickerWords = [],
}: SectionHeaderProps) {
  const baseClassName = hero ? 'page-hero' : 'section-header'
  const animateValue = hero ? 'hero' : 'reveal'

  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName} data-animate={animateValue}>
      {eyebrow ? (
        <AnimatedText
          as="p"
          className="eyebrow type-kicker"
          motion="subheadline"
          stickerWords={stickerWords}
          text={eyebrow}
        />
      ) : null}
      {hero ? (
        <AnimatedText
          as="h1"
          className="section-title type-condensed"
          lines={titleLines}
          motion="hero-impact"
          text={title}
        />
      ) : (
        <AnimatedText
          as="h2"
          className="section-heading type-condensed"
          misprint
          motion="glitch"
          text={title}
        />
      )}
      {description ? (
        <AnimatedText
          as="p"
          className="section-copy"
          motion="subheadline"
          stickerWords={stickerWords}
          text={description}
        />
      ) : null}
    </div>
  )
}

export default SectionHeader
