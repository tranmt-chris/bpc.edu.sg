import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderAlumniPage } from "./templates/alumni-page.mjs";
import { renderPeoplePages } from "./templates/people-pages.mjs";

const root = resolve(import.meta.dirname, "..");
const readJson = async (name) => JSON.parse(await readFile(resolve(root, "public/content", name), "utf8"));

const programmeEntries = await readJson("programmes.json");
const programmes = Array.isArray(programmeEntries)
  ? Object.fromEntries(programmeEntries.map(({ page, ...programme }) => [page, programme]))
  : programmeEntries;

const content = {
  ...(await readJson("site.json")),
  programmes,
  pages: {
    "about.html": await readJson("pages/about.json"),
    "ba.html": await readJson("pages/ba.json"),
    "dip.html": await readJson("pages/dip.json"),
    "index.html": await readJson("pages/index.json"),
    "ma.html": await readJson("pages/ma.json")
  },
  gallery: await readJson("gallery.json")
};

const publicDirectory = resolve(root, "public");
const generatedSiteData = `window.BPC_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
const contentVersion = createHash("sha256").update(generatedSiteData).digest("hex").slice(0, 12);

await writeFile(resolve(publicDirectory, "js/site-data.js"), generatedSiteData, "utf8");

const peoplePages = renderPeoplePages(await readJson("people.json"));
for (const [filename, html] of Object.entries(peoplePages)) {
  await writeFile(resolve(publicDirectory, filename), html, "utf8");
}
await writeFile(
  resolve(publicDirectory, "alumni.html"),
  renderAlumniPage(await readJson("bulletins.json")),
  "utf8"
);

const publicFiles = await readdir(publicDirectory, { withFileTypes: true });
let updatedHtmlFiles = 0;

for (const entry of publicFiles) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

  const htmlPath = resolve(publicDirectory, entry.name);
  const html = await readFile(htmlPath, "utf8");
  const updatedHtml = html.replace(
    /js\/site-data\.js\?v=[^"']+/g,
    `js/site-data.js?v=${contentVersion}`
  );

  if (updatedHtml !== html) {
    await writeFile(htmlPath, updatedHtml, "utf8");
    updatedHtmlFiles += 1;
  }
}

console.log(
  `Generated site data, ${Object.keys(peoplePages).length} people pages and the alumni page with version ${contentVersion}; updated ${updatedHtmlFiles} HTML file(s).`
);
