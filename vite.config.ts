import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { getRobotsTxtForHost, getSitemapXmlForHost } from './src/lib/seoAssets.mjs'

function seoAssetsPlugin(): Plugin {
  return {
    name: 'ridaos-host-aware-seo-assets',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const asset = request.url?.split('?')[0]
        if (asset !== '/robots.txt' && asset !== '/sitemap.xml') {
          next()
          return
        }

        const hostname = String(request.headers.host ?? '').split(':')[0]
        const body = asset === '/robots.txt' ? getRobotsTxtForHost(hostname) : getSitemapXmlForHost(hostname)
        response.statusCode = 200
        response.setHeader('Content-Type', asset === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.end(body)
      })
    },
  }
}

function getBuildHash() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoAssetsPlugin()],
  define: {
    __RIDAOS_BUILD_HASH__: JSON.stringify(getBuildHash()),
  },
})
