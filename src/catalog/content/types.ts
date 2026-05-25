export type FaqItem = {
  question: string
  answer: string
}

export type ObjectionHandler = {
  title: string
  response: string
}

export type CatalogSeoCta = {
  label: string
  href?: string
}

export type LocalCoverageGroup = {
  label: string
  items: readonly string[]
}

export type CatalogSeoContent = {
  entryId: string
  slug: string
  seoTitle: string
  metaDescription: string
  ogImage?: string
  h1: string
  eyebrow: string
  intro: string
  benefits: string[]
  useCases: string[]
  uploadGuidance: string[]
  faq: FaqItem[]
  objectionHandlers: ObjectionHandler[]
  primaryCta: CatalogSeoCta
  secondaryCta: CatalogSeoCta
  localCoverage?: LocalCoverageGroup[]
}
