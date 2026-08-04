import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const publicRoot = join(process.cwd(), 'public');
const files = (await readdir(publicRoot)).filter((file) => file.endsWith('.html'));

for (const file of files) {
  const path = join(publicRoot, file);
  let html = await readFile(path, 'utf8');
  if (!html.includes('css/revamp.css')) {
    html = html.replace('</head>', '\t<link rel="stylesheet" href="css/revamp.css">\n</head>');
  }
  if (!html.includes('js/revamp.js')) {
    html = html.replace('</body>', '\t<script src="js/revamp.js"></script>\n</body>');
  }
  await writeFile(path, html, 'utf8');
}
