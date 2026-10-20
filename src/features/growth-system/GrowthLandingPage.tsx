import { useEffect, useState } from 'react'
import NotFoundPage from '../../components/NotFoundPage'
import PageShell from '../../components/PageShell'
import SectionHeader from '../../components/SectionHeader'
import { getCampaignProductHref, getCampaignQuoteHref } from './campaignAttribution.mjs'
import { getGrowthCampaignFromHash } from './campaigns'

function GrowthLandingPage() {
  const readCampaign = () => getGrowthCampaignFromHash(window.location.hash || window.location.pathname)
  const [campaign, setCampaign] = useState(readCampaign)

  useEffect(() => {
    const syncCampaign = () => setCampaign(readCampaign())
    window.addEventListener('hashchange', syncCampaign)
    return () => window.removeEventListener('hashchange', syncCampaign)
  }, [])

  if (!campaign) return <NotFoundPage />

  return (
    <PageShell className="premium-page growth-landing-page">
      <SectionHeader
        className="premium-hero growth-landing-hero"
        description={campaign.description}
        eyebrow={campaign.eyebrow}
        hero
        title={campaign.title}
      />

      <section className="growth-landing-grid content-section" aria-label="Opciones del proyecto">
        <article className="content-card panel-integrated content-readable">
          <p className="section-label">Tu proyecto</p>
          <ul className="hint-list">
            {campaign.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
          <div className="catalog-cta-row">
            <a className="action-button action-link-button" href={getCampaignQuoteHref(campaign, window.location.search, window.location.hash)}>Preparar solicitud por correo</a>
            <a className="action-button action-button-muted action-link-button" href={getCampaignProductHref(campaign, window.location.search, window.location.hash)}>Ver producto</a>
          </div>
          <p className="growth-landing-note">La solicitud abre un borrador en tu aplicación de correo. RidaosPrint no registra estos datos en la web ni confirma la recepción hasta que envíes el mensaje.</p>
        </article>
      </section>
    </PageShell>
  )
}

export default GrowthLandingPage
