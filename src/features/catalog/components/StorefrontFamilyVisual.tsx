import type { CSSProperties } from 'react'

type StorefrontFamilyVisualProps = {
  title: string
  eyebrow?: string
  image?: string
  accent: string
  tags?: string[]
  className?: string
  variant?: 'hero' | 'card' | 'feature'
}

export function StorefrontFamilyVisual({
  title,
  eyebrow,
  image,
  accent,
  tags = [],
  className,
  variant = 'card',
}: StorefrontFamilyVisualProps) {
  const style = {
    '--storefront-accent': accent,
    '--storefront-image': image ? `url("${image}")` : 'none',
  } as CSSProperties

  return (
    <div
      aria-hidden="true"
      className={className ? `storefront-family-visual ${className}` : 'storefront-family-visual'}
      data-variant={variant}
      style={style}
    >
      <div className="storefront-family-visual__backdrop" data-overlay-reveal />
      <div className="storefront-family-visual__beam" data-overlay-reveal />
      <div className="storefront-family-visual__grid" />
      <div className="storefront-family-visual__image" data-parallax data-parallax-strength={variant === 'hero' ? '7' : '4'} />
      <div className="storefront-family-visual__chrome">
        {eyebrow ? <span className="storefront-family-visual__eyebrow">{eyebrow}</span> : null}
        <strong className="storefront-family-visual__title">{title}</strong>
        {tags.length ? (
          <div className="storefront-family-visual__tags">
            {tags.slice(0, variant === 'hero' ? 3 : 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default StorefrontFamilyVisual
