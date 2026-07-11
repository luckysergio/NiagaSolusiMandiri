import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sitemap XML content
const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Halaman Utama -->
  <url>
    <loc>https://betoncortangerang.com/</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="id" href="https://betoncortangerang.com/"/>
  </url>

  <!-- Halaman Statis -->
  <url>
    <loc>https://betoncortangerang.com/tentang</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/layanan</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/kontak</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/harga</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Layanan -->
  <url>
    <loc>https://betoncortangerang.com/layanan/beton-readymix</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/layanan/sewa-pompa-beton</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/layanan/finishing-trowel</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/layanan/jasa-cor-beton</loc>
    <lastmod>2026-06-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Posts -->
  <url>
    <loc>https://betoncortangerang.com/blog/apa-itu-pompa-beton-dan-bagaimana-cara-kerjanya</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/beton-readymix-vs-beton-cor-manual-mana-yang-lebih-baik</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/panduan-memilih-mutu-beton-k-125-hingga-k-500</loc>
    <lastmod>2026-06-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/kapan-saya-membutuhkan-sewa-pompa-beton</loc>
    <lastmod>2026-06-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/5-hal-yang-harus-diperhatikan-sebelum-menyewa-pompa-beton</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/apa-itu-finishing-trowel-dan-mengapa-penting</loc>
    <lastmod>2026-06-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/tips-memilih-supplier-beton-cor-yang-tepat</loc>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/cara-menghemat-biaya-pada-proyek-pengecoran</loc>
    <lastmod>2026-05-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/tren-konstruksi-indonesia-2026-peluang-kontraktor</loc>
    <lastmod>2026-05-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/dampak-teknologi-digital-pada-industri-konstruksi</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/solusi-pengecoran-di-gang-sempit-pakai-truk-minimix-dan-pompa-mini</loc>
    <lastmod>2026-05-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/mengenal-jenis-pompa-beton-standar-long-boom-dan-mini</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/pentingnya-mengetahui-slump-test-beton-sebelum-pengecoran</loc>
    <lastmod>2026-05-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/cara-menghitung-kebutuhan-beton-cor-dak-lantai-rumah</loc>
    <lastmod>2026-05-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/penyebab-beton-retak-setelah-dicor-dan-cara-mengatasinya</loc>
    <lastmod>2026-05-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/tips-sukses-pengecoran-rumah-2-lantai-agar-hemat-biaya</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/jasa-sewa-concrete-pump-murah-di-tangerang-selatan</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/panduan-proyek-rigid-pavement-jalan-perumahan-beton-mutu-tinggi</loc>
    <lastmod>2026-05-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/mengapa-beton-cor-ready-mix-lebih-unggul-dari-adukan-manual</loc>
    <lastmod>2026-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://betoncortangerang.com/blog/daftar-harga-beton-cor-ready-mix-tangerang-terbaru-2026</loc>
    <lastmod>2026-04-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`

// Robots.txt content
const robotsTxt = `# robots.txt for betoncortangerang.com
# https://betoncortangerang.com/robots.txt

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login/
Disallow: /register/
Disallow: /auth/
Disallow: /profile/
Disallow: /settings/
Disallow: /cart/
Disallow: /checkout/
Disallow: /payment/
Disallow: /order/
Disallow: /tracking/
Disallow: /invoice/
Disallow: /download/
Disallow: /temp/
Disallow: /cache/
Disallow: /logs/
Disallow: /backup/
Disallow: /config/
Disallow: /vendor/
Disallow: /node_modules/
Disallow: /storage/
Disallow: /tests/
Disallow: /docs/
Disallow: /_next/
Disallow: /static/
Disallow: /assets/

# Sitemap
Sitemap: https://betoncortangerang.com/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Host
Host: https://betoncortangerang.com

# Googlebot
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /_next/
Crawl-delay: 0.5

# Bingbot
User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Crawl-delay: 0.5

# Yahoo
User-agent: Yahoo
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

# Yandex
User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Crawl-delay: 0.5

# Baidu
User-agent: Baiduspider
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Crawl-delay: 0.5`

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Plugin untuk serve sitemap dan robots.txt di development
    {
      name: 'serve-seo-files',
      configureServer(server) {
        server.middlewares.use('/sitemap.xml', (req, res) => {
          res.setHeader('Content-Type', 'application/xml')
          res.end(sitemapXML)
        })
        server.middlewares.use('/robots.txt', (req, res) => {
          res.setHeader('Content-Type', 'text/plain')
          res.end(robotsTxt)
        })
      },
      // Untuk build, copy files ke dist
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: sitemapXML
        })
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: robotsTxt
        })
      }
    }
  ],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // PERBAIKAN: manualChunks harus berupa FUNGSI, bukan OBJECT
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Kelompokkan vendor libraries
          if (id.includes('node_modules')) {
            // React dan React DOM
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor'
            }
            // Lucide React
            if (id.includes('lucide-react')) {
              return 'ui'
            }
            // Library lainnya
            return 'vendor'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  }
})