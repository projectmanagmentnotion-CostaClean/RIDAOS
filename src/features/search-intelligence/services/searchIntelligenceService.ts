import { topicalClusters } from '../clusters/topicalClusters'
import { entityRelationshipMap } from '../entities/entityRelationshipMap'
import { keywordGroups } from '../keywords/keywordGroups'
import { localSearchMap } from '../local/localSearchMap'
import { answerStyleQuestions } from '../questions/answerStyleQuestions'
import type {
  AnswerStyleQuestion,
  EntityRelationshipNode,
  SearchEntityId,
  SearchIntent,
  SearchKeywordGroup,
  SearchLocalityId,
  SearchTopicCluster,
} from '../types/searchIntelligence'

export function getKeywordGroupsByEntity(entity: SearchEntityId): SearchKeywordGroup[] {
  return keywordGroups.filter((group) => group.entity === entity)
}

export function getQuestionsByEntity(entity: SearchEntityId): AnswerStyleQuestion[] {
  return answerStyleQuestions.filter((item) => item.entity === entity)
}

export function getQuestionsByLocality(locality: SearchLocalityId): AnswerStyleQuestion[] {
  return answerStyleQuestions.filter((item) => item.locality === locality)
}

export function getEntityNode(entity: SearchEntityId): EntityRelationshipNode | undefined {
  return entityRelationshipMap.find((node) => node.id === entity)
}

export function getClustersByIntent(intent: SearchIntent): SearchTopicCluster[] {
  return topicalClusters.filter((cluster) => cluster.intentMix.includes(intent))
}

export function getLocalArea(locality: SearchLocalityId) {
  return localSearchMap.find((area) => area.id === locality)
}

export function getRelatedKeywordGroups(questionId: string): SearchKeywordGroup[] {
  const question = answerStyleQuestions.find((item) => item.id === questionId)

  if (!question) {
    return []
  }

  return keywordGroups.filter((group) => group.entity === question.entity)
}

export function buildEntitySearchSnapshot(entity: SearchEntityId) {
  return {
    entity: getEntityNode(entity),
    keywords: getKeywordGroupsByEntity(entity),
    questions: getQuestionsByEntity(entity),
    clusters: topicalClusters.filter((cluster) => cluster.entity === entity),
  }
}
