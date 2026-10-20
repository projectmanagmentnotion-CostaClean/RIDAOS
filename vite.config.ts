import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { siteUrl } from './src/content/localSeoContent.ts'
import { growthCampaignContent } from './src/features/growth-system/campaignContent.ts'

function getBuildHash() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'unknown'
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

function growthLandingPages() {
  return {
    name: 'ridaos-growth-landing-pages',
    apply: 'build' as const,
    async closeBundle() {
      const outputDirectory = resolve(process.cwd(), 'dist')
      const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')

      await Promise.all(growthCampaignContent.map(async (campaign) => {
        const canonicalUrl = `${siteUrl}/growth/${campaign.slug}`
        const title = `${campaign.eyebrow} | RidaosPrint`
        const metadata = [
          `<meta name="description" content="${escapeHtml(campaign.description)}" />`,
          '<meta name="robots" content="index,follow" />',
          `<link rel="canonical" href="${canonicalUrl}" />`,
          `<meta property="og:title" content="${escapeHtml(campaign.title)}" />`,
          `<meta property="og:description" content="${escapeHtml(campaign.description)}" />`,
          '<meta property="og:type" content="website" />',
          `<meta property="og:url" content="${canonicalUrl}" />`,
          `<meta property="og:image" content="${siteUrl}/assets/brand/ridaos-logo-main.png" />`,
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:title" content="${escapeHtml(campaign.title)}" />`,
          `<meta name="twitter:description" content="${escapeHtml(campaign.description)}" />`,
        ].join('\n    ')
        const page = template
          .replace('<html lang="en">', '<html lang="es">')
          .replace('<title>ridaosprint-pro</title>', `<title>${escapeHtml(title)}</title>`)
          .replace('</head>', `    ${metadata}\n  </head>`)
        const pageDirectory = resolve(outputDirectory, 'growth', campaign.slug)

        await mkdir(pageDirectory, { recursive: true })
        await writeFile(resolve(pageDirectory, 'index.html'), page, 'utf8')
      }))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), growthLandingPages()],
  define: {
    __RIDAOS_BUILD_HASH__: JSON.stringify(getBuildHash()),
  },
})
