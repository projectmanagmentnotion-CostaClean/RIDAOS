import SectionHeader from '../../../../components/SectionHeader'

type ProductHeroSectionProps = {
  eyebrow: string
  title: string
  description: string
  stickerWords?: string[]
}

export function ProductHeroSection({
  eyebrow,
  title,
  description,
  stickerWords,
}: ProductHeroSectionProps) {
  return (
    <section className="product-experience-hero" data-product-reveal>
      <SectionHeader
        className="premium-hero type-split"
        description={description}
        eyebrow={eyebrow}
        hero
        stickerWords={stickerWords}
        title={title}
      />
    </section>
  )
}
