import { useMemo } from 'react'
import PageShell from '../components/PageShell'
import { getContentByEntryId } from '../catalog/content/contentSelectors'
import { dtfEntry } from '../catalog/products/dtf'
import AnswersSection from '../sections/home/AnswersSection'
import EditorialSection from '../sections/home/EditorialSection'
import FinalCtaSection from '../sections/home/FinalCtaSection'
import FoundationSection from '../sections/home/FoundationSection'
import HeroSection from '../sections/home/HeroSection'
import MetricsSection from '../sections/home/MetricsSection'
import PreparationSection from '../sections/home/PreparationSection'
import ProcessSection from '../sections/home/ProcessSection'
import TrustSection from '../sections/home/TrustSection'

/**
 * Editable Zones:
 * - HOME_HERO
 * - HOME_METRICS
 * - HOME_FOUNDATION
 * - HOME_PROCESS
 * - HOME_EDITORIAL
 * - HOME_PREPARATION
 * - HOME_TRUST
 * - HOME_FAQ
 * - HOME_FINAL_CTA
 */
function Home() {
  const homeContent = useMemo(() => getContentByEntryId(dtfEntry.id), [])

  return (
    <PageShell className="hero-page premium-page home-page">
      {/* HERO SECTION */}
      <HeroSection content={homeContent} />

      {/* METRICS SECTION */}
      <MetricsSection />

      {/* FOUNDATION SECTION */}
      <FoundationSection />

      {/* PROCESS SECTION */}
      <ProcessSection />

      {/* EDITORIAL SECTION */}
      <EditorialSection />

      {/* PREPARATION SECTION */}
      <PreparationSection />

      {/* TRUST SECTION */}
      <TrustSection />

      {/* ANSWERS SECTION */}
      <AnswersSection />

      {/* CTA SECTION */}
      <FinalCtaSection />
    </PageShell>
  )
}

export default Home
