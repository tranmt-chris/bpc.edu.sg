import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
import { renderSiteFooter, renderSiteHeader, setSiteShell } from "./templates/site-page.mjs";

const root = resolve(import.meta.dirname, "..");
const outputArgument = process.argv.indexOf("--output");
const outputDirectory = resolve(root, outputArgument === -1 ? "dist" : process.argv[outputArgument + 1]);
if (outputArgument !== -1 && !process.argv[outputArgument + 1]) {
  throw new Error("Expected a directory after --output.");
}
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

const site = await readJson("site.json");
setSiteShell(site);

const publicDirectory = resolve(root, "public");

// The public folder is CMS source (assets and editable JSON), while the output
// folder is disposable deployment artefact. Never copy editable content or
// previously generated pages into a deployable site.
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(publicDirectory, outputDirectory, {
  recursive: true,
  filter: (source) => {
    const relative = source.slice(publicDirectory.length).replaceAll("\\", "/");
    return relative !== "/content" && !relative.startsWith("/content/") && !relative.endsWith(".html");
  }
});

const peoplePages = renderPeoplePages(await readJson("people.json"));
for (const [filename, html] of Object.entries(peoplePages)) {
  await writeFile(resolve(outputDirectory, filename), html, "utf8");
}
await writeFile(
  resolve(outputDirectory, "alumni.html"),
  renderAlumniPage(await readJson("bulletins.json")),
  "utf8"
);

for (const filename of ["intro.html", "introc.html", "dipc.html"]) {
  await writeFile(
    resolve(outputDirectory, filename),
    renderProgrammePage(
      { page: filename, ...programmes[filename] },
      await readJson(`pages/${filename.replace(".html", ".json")}`)
    ),
    "utf8"
  );
}

await writeFile(
  resolve(outputDirectory, "courses.html"),
  renderCoursesPage(programmeEntries, await readJson("pages/courses.json")),
  "utf8"
);

await writeFile(
  resolve(outputDirectory, "key.html"),
  renderKeyDatesPage(await readJson("key-dates.json")),
  "utf8"
);

const resourcePages = {
  "books.html": renderBooksPage(await readJson("books.json")),
  "elibrary.html": renderElibraryPage(await readJson("elibrary.json")),
  "team.html": renderPeopleOverviewPage(await readJson("people-overview.json"))
};
for (const [filename, html] of Object.entries(resourcePages)) {
  await writeFile(resolve(outputDirectory, filename), html, "utf8");
}

const contactPages = {
  "contact.html": renderContactPage(await readJson("contact.json")),
  "thank-you.html": renderThankYouPage(await readJson("thank-you.json"))
};
for (const [filename, html] of Object.entries(contactPages)) {
  await writeFile(resolve(outputDirectory, filename), html, "utf8");
}

await writeFile(resolve(outputDirectory, "gallery.html"), renderGalleryPage(gallery), "utf8");
await writeFile(resolve(outputDirectory, "index.html"), renderHomePage(homePage, gallery.events[0]), "utf8");
await writeFile(resolve(outputDirectory, "about.html"), renderAboutPage(aboutPage), "utf8");
await writeFile(resolve(outputDirectory, "ba.html"), renderBaPage(programmes["ba.html"], baPage), "utf8");
await writeFile(resolve(outputDirectory, "dip.html"), renderDiplomaPage(programmes["dip.html"], diplomaPage), "utf8");
await writeFile(resolve(outputDirectory, "ma.html"), renderMaPage(programmes["ma.html"], maPage), "utf8");

let updatedArchivedPages = 0;
for (const filename of ["bc.html", "visit.html"]) {
  const htmlPath = resolve(root, "scripts/templates/legacy", filename);
  const html = await readFile(htmlPath, "utf8");
  const updatedHtml = html
    .replace(/<header data-site-header>[\s\S]*?<\/header>/, renderSiteHeader())
    .replace(/<footer data-site-footer(?: class="[^"]*")?>[\s\S]*?<\/footer>/, renderSiteFooter())
    .replace(/\s*<script src="js\/site-data\.js\?v=[^"]+"><\/script>/, "");

  await writeFile(resolve(outputDirectory, filename), updatedHtml, "utf8");
  if (updatedHtml !== html) updatedArchivedPages += 1;
}

console.log(
  `Generated ${Object.keys(peoplePages).length + 12 + Object.keys(resourcePages).length + Object.keys(contactPages).length} structured pages in ${outputDirectory}; updated ${updatedArchivedPages} archived page(s).`
);
