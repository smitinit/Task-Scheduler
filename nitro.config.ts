import { defineConfig } from 'nitro'

export default defineConfig({
  prerender: {
    crawlLinks: false,
    routes: ['/sitemap.xml', '/robots.txt'],
    ignore: ['/api'],
  },
})
