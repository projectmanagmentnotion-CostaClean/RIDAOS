import { useEffect, useState } from 'react'
import type { ArtworkProductRuleKey, ProductTemplateAsset } from '../../../domain/storage'
import { listProductTemplates } from '../services/templateCatalogService'

export function useProductTemplates(ruleKey: ArtworkProductRuleKey) {
  const [templates, setTemplates] = useState<ProductTemplateAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void listProductTemplates(ruleKey).then((nextTemplates) => {
      if (cancelled) {
        return
      }

      setTemplates(nextTemplates)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [ruleKey])

  return {
    templates,
    isLoading,
  }
}
