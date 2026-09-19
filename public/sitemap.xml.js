// Dynamic Sitemap Generator for Sachit Developer Portfolio (sachin-portfoli.vercel.app)
export function generateSitemap(baseUrl = 'https://sachin-portfoli.vercel.app') {
  const today = new Date().toISOString().split('T')[0];
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/resume', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.8', changefreq: 'weekly' },
    { path: '/terms', priority: '0.8', changefreq: 'weekly' }
  ];

  const xmlEntries = routes.map(r => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

export default generateSitemap;
