export type SearchIntent =
  | 'transactional'
  | 'commercial'
  | 'informational'
  | 'local'
  | 'comparative'
  | 'navigational'

export type SearchPriority = 'high' | 'medium' | 'low'

export type SearchJourneyStage = 'discover' | 'evaluate' | 'decide' | 'prepare'

export type SearchEntityId =
  | 'dtf'
  | 'dti'
  | 'rotulacion'
  | 'vinilo-comercial'
  | 'tarjetas'
  | 'flyers'
  | 'pegatinas'
  | 'gran-formato'
  | 'branding'
  | 'uniformes'

export type SearchLocalityId =
  | 'barcelona'
  | 'blanes'
  | 'girona'
  | 'costa-brava'
  | 'cataluna'
  | 'espana'

export type QuestionFrame = 'quien' | 'que' | 'como' | 'cuando' | 'donde' | 'por-que' | 'comparacion'

export type SearchKeywordGroup = {
  id: string
  label: string
  primaryTerm: string
  variants: readonly string[]
  intents: readonly SearchIntent[]
  entity: SearchEntityId
  stage: SearchJourneyStage
  priority: SearchPriority
  localities?: readonly SearchLocalityId[]
  relatedServices: readonly string[]
  relatedProducts: readonly string[]
}

export type AnswerStyleQuestion = {
  id: string
  question: string
  answer: string
  frame: QuestionFrame
  entity: SearchEntityId
  intents: readonly SearchIntent[]
  priority: SearchPriority
  locality?: SearchLocalityId
  relatedServices: readonly string[]
  relatedProducts: readonly string[]
}

export type EntityRelationshipNode = {
  id: SearchEntityId
  label: string
  description: string
  relatedEntities: readonly SearchEntityId[]
  relatedServices: readonly string[]
  relatedProducts: readonly string[]
  relatedQuestions: readonly string[]
}

export type LocalSearchArea = {
  id: SearchLocalityId
  label: string
  keywords: readonly string[]
  services: readonly string[]
  faqIds: readonly string[]
  opportunityNotes: readonly string[]
}

export type SearchTopicCluster = {
  id: string
  label: string
  hub: string
  entity: SearchEntityId
  intentMix: readonly SearchIntent[]
  supportingPages: readonly string[]
  internalLinks: readonly string[]
  questionIds: readonly string[]
  keywordGroupIds: readonly string[]
}

export type CompetitorPattern = {
  competitor: 'Pixartprinting' | 'VistaPrint' | 'HelloPrint' | 'OnlinePrinters'
  focus: string
  strengths: readonly string[]
  observedPatterns: readonly string[]
  gapOpportunity: readonly string[]
  sourceUrls: readonly string[]
}
