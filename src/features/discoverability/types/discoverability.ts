export type DiscoverabilityHubId =
  | 'dti'
  | 'rotulacion'
  | 'rotulacion-furgonetas'
  | 'textil-personalizado'
  | 'pegatinas'
  | 'vinilo-impreso'
  | 'tarjetas-papeleria'
  | 'empresas'
  | 'barcelona'
  | 'blanes'
  | 'girona-costa-brava'
  | 'espana'

export type DiscoverabilityLink = {
  id: string
  title: string
  description: string
  href: string
  label?: string
  tag?: string
}

export type DiscoverabilityHub = {
  id: DiscoverabilityHubId
  title: string
  description: string
  primaryKeywords: readonly string[]
  relatedServices: readonly DiscoverabilityLink[]
  relatedProducts: readonly DiscoverabilityLink[]
  relatedGuides: readonly DiscoverabilityLink[]
  localVariants: readonly string[]
  upsellRules: readonly string[]
  internalLinks: readonly DiscoverabilityLink[]
}

export type UpsellRule = {
  id: string
  trigger: string
  label: string
  suggestions: readonly DiscoverabilityLink[]
}

export type FrequentlyCombinedBundle = {
  id: string
  title: string
  description: string
  items: readonly DiscoverabilityLink[]
}

export type LocalServiceHub = {
  id: string
  title: string
  description: string
  locality: string
  links: readonly DiscoverabilityLink[]
}
