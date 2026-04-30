import type { ReactNode } from 'react'
import PageShell from './PageShell'
import SectionHeader from './SectionHeader'

type ProductConfiguratorShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  className?: string
}

function ProductConfiguratorShell({
  eyebrow,
  title,
  description,
  children,
  className = '',
}: ProductConfiguratorShellProps) {
  return (
    <PageShell className={`premium-page product-page ${className}`.trim()}>
      <SectionHeader
        className="premium-hero product-page-hero"
        description={description}
        eyebrow={eyebrow}
        hero
        title={title}
      />
      {children}
    </PageShell>
  )
}

export default ProductConfiguratorShell
