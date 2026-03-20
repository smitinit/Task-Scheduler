import { defineConfig } from 'nitro/config'

export default defineConfig({
  preset: 'vercel',
  prerender: {
    crawlLinks: false,
    routes: ['/sitemap.xml', '/robots.txt'],
    ignore: ['/api'],
  },
})
