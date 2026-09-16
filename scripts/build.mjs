import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'site');
const stage = join(root, '.build-stage');
const dist = join(root, 'dist');
const siteUrl = 'https://createdbyalvin.com';
const sitemapPaths = ['/', '/privacy', '/terms'];
const requiredFiles = ['index.html', 'privacy.html', 'terms.html', 'styles.css', 'app.js', 'favicon.png'];
for (const file of requiredFiles) if (!existsSync(join(source, file))) throw new Error(`Missing required site file: ${file}`);
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
try {
  for (const file of requiredFiles) cpSync(join(source, file), join(stage, file));
  if (existsSync(join(source, 'assets'))) cpSync(join(source, 'assets'), join(stage, 'assets'), { recursive: true });
  writeFileSync(join(stage, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  writeFileSync(join(stage, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync(join(stage, '404.html'), readFileSync(join(source, 'index.html'), 'utf8').replace(/<title>[^<]*<\/title>/, '<title>Page not found | Created by Alvin</title>').replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex" />'));
  writeFileSync(join(stage, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Cache-Control: public, max-age=0, must-revalidate\n');
  rmSync(dist, { recursive: true, force: true });
  renameSync(stage, dist);
  console.log('Built Created by Alvin → dist/');
} catch (error) { rmSync(stage, { recursive: true, force: true }); throw error; }
