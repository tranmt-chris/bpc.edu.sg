import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, normalize, relative } from 'node:path';

const publicRoot = join(process.cwd(), 'public');
const baseUrl = new URL('https://www.bpc.edu.sg/');
const references = new Set();

function collect(text, sourceUrl, pattern) {
  for (const match of text.matchAll(pattern)) {
    const raw = match[1].trim();
    if (!raw || /^(?:data:|mailto:|tel:|javascript:|#|\/\/)/i.test(raw)) continue;
    let url;
    try { url = new URL(raw, sourceUrl); } catch { continue; }
    if (url.hostname !== baseUrl.hostname || /\.html$/i.test(url.pathname)) continue;
    references.add(url.href.split('#')[0]);
  }
}

for (const file of (await readdir(publicRoot)).filter((name) => name.endsWith('.html'))) {
  const text = await readFile(join(publicRoot, file), 'utf8');
  collect(text, new URL(file, baseUrl), /(?:href|src)\s*=\s*["']([^"'#?]+(?:\?[^"'#]*)?)/gi);
}

const cssDir = join(publicRoot, 'css');
for (const file of (await readdir(cssDir)).filter((name) => name.endsWith('.css'))) {
  const text = await readFile(join(cssDir, file), 'utf8');
  collect(text, new URL(`css/${file}`, baseUrl), /url\(\s*["']?([^)'"?#]+(?:\?[^)'"#]*)?)/gi);
}

const queue = [];
for (const href of references) {
  const url = new URL(href);
  const decodedPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!decodedPath) continue;
  const target = normalize(join(publicRoot, decodedPath));
  if (relative(publicRoot, target).startsWith('..')) continue;
  try { if ((await stat(target)).size > 0) continue; } catch {}
  queue.push({ url, target });
}

const failures = [];
let downloaded = 0;
let next = 0;

async function worker() {
  while (true) {
    const index = next++;
    if (index >= queue.length) return;
    const { url, target } = queue[index];
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (!bytes.length) throw new Error('empty response');
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes);
      downloaded++;
    } catch (error) {
      failures.push(`${url.pathname}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(8, queue.length || 1) }, worker));
console.log(JSON.stringify({ discovered: references.size, missing: queue.length, downloaded, failed: failures.length, failures }, null, 2));
