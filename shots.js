// Takes Leonida Trophy Atlas' four screenshots from app/ in entry/.
// Serves app/ on localhost, opens each shots.json view at 1280x800 in
// headless Chromium, waits for the guide to render, and writes JPEGs to
// entry/screenshots/. Run from ~/workspace/makefun/gta6-trophy-guide-01/entry:
//
//   node shots.js
//
// Then run main.ts so the new images are copied into /output.
const { createServer } = require('node:http');
const { readFileSync, existsSync, mkdirSync, statSync } = require('node:fs');
const { join, extname } = require('node:path');
const { chromium } = require('/home/hatch/workspace/makefun/token-radar-01/shot-tool/node_modules/playwright');

const root = '/home/hatch/workspace/makefun/gta6-trophy-guide-01/entry';
const appDir = join(root, 'app');
const shotDir = join(root, 'screenshots');
const shots = JSON.parse(readFileSync(join(root, 'shots.json'), 'utf8'));

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  const rel = path === '/' ? 'index.html' : path.slice(1);
  const file = join(appDir, rel);
  if (!file.startsWith(appDir) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

async function main() {
  mkdirSync(shotDir, { recursive: true });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const shot of shots) {
      const page = await browser.newPage({ viewport: shot.viewport });
      const errors = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
      });
      page.on('requestfailed', (req) => errors.push(`reqfail: ${req.url()}`));
      await page.goto(`${base}${shot.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      try {
        await page.waitForFunction(() => document.querySelectorAll('#trophyList .trophy').length === 55 || document.querySelectorAll('.stage').length > 0 || document.querySelectorAll('.missCard').length > 0, { timeout: 15000 });
      } catch (e) {
        errors.push('TIMEOUT waiting for render');
      }
      await page.waitForTimeout(800);
      const path = join(shotDir, shot.file);
      await page.screenshot({ path, type: 'jpeg', quality: 82 });
      const bytes = statSync(path).size;
      console.log(`${shot.file}: ${bytes} bytes${bytes > 262144 ? ' OVER THE 256 KiB CAP' : ''}`);
      if (errors.length > 0) console.log(`  errors for ${shot.file}:\n  - ${errors.join('\n  - ')}`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
