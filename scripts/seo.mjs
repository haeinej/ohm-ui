import {readdir, readFile, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../dist/client/', import.meta.url);
const urls = new Set();
for (const file of (await readdir(root)).filter(f => f.endsWith('.html'))) {
  const html = await readFile(new URL(file, root), 'utf8');
  if (file === '404.html') {
    assert.match(html, /name="robots" content="noindex"/);
    continue;
  }
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert.ok(canonical, `${file}: canonical missing`);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:image"/);
  urls.add(canonical[1]);
}
assert.ok(urls.size > 1, 'Prerendered gallery pages missing');
await writeFile(new URL('sitemap.xml', root), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [...urls].sort().map(url => `  <url><loc>${url}</loc></url>`).join('\n') + '\n</urlset>\n');
console.log(`SEO: ${urls.size} canonical gallery pages verified and added to sitemap`);
