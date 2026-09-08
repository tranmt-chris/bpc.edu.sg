import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderAlumniPage } from "./templates/alumni-page.mjs";
import { renderCoursesPage } from "./templates/courses-page.mjs";
import { renderContactPage, renderThankYouPage } from "./templates/contact-pages.mjs";
import { renderAboutPage, renderHomePage } from "./templates/core-pages.mjs";
import { renderBaPage, renderDiplomaPage, renderMaPage } from "./templates/degree-programme-pages.mjs";
import { renderGalleryPage } from "./templates/gallery-page.mjs";
import { renderKeyDatesPage } from "./templates/key-dates-page.mjs";
import { renderPeoplePages } from "./templates/people-pages.mjs";
import { renderProgrammePage } from "./templates/programme-page.mjs";
import { renderBooksPage, renderElibraryPage, renderPeopleOverviewPage } from "./templates/resource-pages.mjs";

const root = resolve(import.meta.dirname, "..");
const readJson = async (name) => JSON.parse(await readFile(resolve(root, "public/content", name), "utf8"));

const programmeEntries = await readJson("programmes.json");
const programmes = Array.isArray(programmeEntries)
  ? Object.fromEntries(programmeEntries.map(({ page, ...programme }) => [page, programme]))
  : programmeEntries;
const gallery = await readJson("gallery.json");
const homePage = await readJson("pages/index.json");
const aboutPage = await readJson("pages/about.json");
const baPage = await readJson("pages/ba.json");
const diplomaPage = await readJson("pages/dip.json");
const maPage = await readJson("pages/ma.json");

const content = {
  ...(await readJson("site.json"))
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

for (const filename of ["intro.html", "introc.html", "dipc.html"]) {
  await writeFile(
    resolve(publicDirectory, filename),
    renderProgrammePage(
      { page: filename, ...programmes[filename] },
      await readJson(`pages/${filename.replace(".html", ".json")}`)
    ),
    "utf8"
  );
}

await writeFile(
  resolve(publicDirectory, "courses.html"),
  renderCoursesPage(programmeEntries, await readJson("pages/courses.json")),
  "utf8"
);

await writeFile(
  resolve(publicDirectory, "key.html"),
  renderKeyDatesPage(await readJson("key-dates.json")),
  "utf8"
);

const resourcePages = {
  "books.html": renderBooksPage(await readJson("books.json")),
  "elibrary.html": renderElibraryPage(await readJson("elibrary.json")),
  "team.html": renderPeopleOverviewPage(await readJson("people-overview.json"))
};
for (const [filename, html] of Object.entries(resourcePages)) {
  await writeFile(resolve(publicDirectory, filename), html, "utf8");
}

const contactPages = {
  "contact.html": renderContactPage(await readJson("contact.json")),
  "thank-you.html": renderThankYouPage(await readJson("thank-you.json"))
};
for (const [filename, html] of Object.entries(contactPages)) {
  await writeFile(resolve(publicDirectory, filename), html, "utf8");
}

await writeFile(resolve(publicDirectory, "gallery.html"), renderGalleryPage(gallery), "utf8");
await writeFile(resolve(publicDirectory, "index.html"), renderHomePage(homePage, gallery.events[0]), "utf8");
await writeFile(resolve(publicDirectory, "about.html"), renderAboutPage(aboutPage), "utf8");
await writeFile(resolve(publicDirectory, "ba.html"), renderBaPage(programmes["ba.html"], baPage), "utf8");
await writeFile(resolve(publicDirectory, "dip.html"), renderDiplomaPage(programmes["dip.html"], diplomaPage), "utf8");
await writeFile(resolve(publicDirectory, "ma.html"), renderMaPage(programmes["ma.html"], maPage), "utf8");

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
  `Generated site data and ${Object.keys(peoplePages).length + 12 + Object.keys(resourcePages).length + Object.keys(contactPages).length} structured pages with version ${contentVersion}; updated ${updatedHtmlFiles} HTML file(s).`
);
