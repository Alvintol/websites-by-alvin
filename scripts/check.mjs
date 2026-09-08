import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const app = readFileSync(join(dist, 'app.js'), 'utf8');
const fail = (message) => { throw new Error(message); };
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length) fail('Duplicate HTML IDs.');
if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) fail('Expected exactly one H1.');
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#') && !ids.includes(value.slice(1))) fail(`Broken section link: ${value}`);
  if (value.startsWith('/') && !value.startsWith('//') && !existsSync(join(dist, value.slice(1)))) fail(`Missing local file: ${value}`);
}
for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(tag[0])) fail('External links require safe rel attributes.');
if (!/<meta name="description" content="[^"]+">/.test(html)) fail('Missing page description.');
if (!html.includes('<meta name="robots" content="index, follow">')) {
  fail('Public site must allow indexing.');
}
if (html.includes('tel:')) fail('Draft should not publish an unconfirmed phone number.');
if (!html.includes('mailto:imallbeans+creates@gmail.com')) fail('Confirmed contact email is missing.');
for (const match of html.matchAll(/mailto:([^?\"]+)/g)) if (match[1] !== 'imallbeans+creates@gmail.com') fail(`Unexpected contact email: ${match[1]}`);
if (!html.includes('Simple web design that won’t break the bank.')) fail('Primary tagline is missing.');
if (html.includes('Most people call me Beans') || html.includes('Message me on LinkedIn')) fail('Retired copy is still present.');
for (const asset of ['hero-calgary-skyline.webp', 'hero-bridge-left.png', 'hero-bridge-floor.png', 'hero-bridge-right.png']) {
  if (!html.includes(`/assets/${asset}`)) fail(`Hero depth asset is not used: ${asset}`);
}
if (!html.includes('data-hero') || !app.includes('updateHeroDepth')) fail('Hero depth motion is not wired up.');
if (!html.includes('/assets/about-alvin.webp') || !html.includes('alt="Alvin Tolentino smiling"')) fail('About portrait is missing or has no useful alternative text.');
const exampleKeys = [...html.matchAll(/data-example="([^"]+)"/g)].map((match) => match[1]);
if (exampleKeys.length !== 5) fail('Expected five starting-point examples.');
for (const key of exampleKeys) if (!app.includes(`  ${key}: {`)) fail(`Missing content state for example: ${key}`);
for (const file of ['styles.css', 'app.js', 'favicon.svg', '404.html', 'robots.txt', '_headers']) if (!existsSync(join(dist, file))) fail(`Missing output file: ${file}`);
const total = ['index.html', 'styles.css', 'app.js', 'favicon.svg'].reduce((sum, file) => sum + statSync(join(dist, file)).size, 0);
if (total > 300_000) fail('Core page exceeds the 300 KB budget.');
console.log(`Passed: page structure, section links, hero and portrait assets, external-link safety, draft privacy, confirmed contact email, and size budget (${Math.round(total / 1024)} KiB).`);
