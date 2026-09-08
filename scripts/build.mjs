import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'site');
const stage = join(root, '.build-stage');
const dist = join(root, 'dist');
for (const file of ['index.html', 'styles.css', 'app.js', 'favicon.svg']) if (!existsSync(join(source, file))) throw new Error(`Missing required site file: ${file}`);
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
try {
  for (const file of ['index.html', 'styles.css', 'app.js', 'favicon.svg']) cpSync(join(source, file), join(stage, file));
  if (existsSync(join(source, 'assets'))) cpSync(join(source, 'assets'), join(stage, 'assets'), { recursive: true });
  writeFileSync(join(stage, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  writeFileSync(join(stage, '404.html'), readFileSync(join(source, 'index.html'), 'utf8').replace('<title>Websites by Alvin | Simple websites for small businesses</title>', '<title>Page not found | Websites by Alvin</title>'));
  writeFileSync(join(stage, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Cache-Control: public, max-age=0, must-revalidate\n');
  rmSync(dist, { recursive: true, force: true });
  renameSync(stage, dist);
  console.log('Built Websites by Alvin → dist/');
} catch (error) { rmSync(stage, { recursive: true, force: true }); throw error; }
