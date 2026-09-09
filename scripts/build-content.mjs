import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
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
const readProgrammes = async () => {
  const directory = resolve(root, "public/content/programmes");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  return Promise.all(files.map(async (file) => JSON.parse(await readFile(resolve(directory, file), "utf8"))));
};

const programmeEntries = await readProgrammes();
const programmes = new Map(programmeEntries.map((programme) => [programme.id, programme]));
const programmeDetails = (programme) => programme.details?.[0] || {};
const requiredProgrammeIds = ["intro-en", "intro-zh", "diploma-en", "diploma-zh", "ba", "ma"];
if (programmes.size !== programmeEntries.length || requiredProgrammeIds.some((id) => !programmes.has(id))) {
  throw new Error("Programme records must contain each required unique programme ID.");
}
for (const programme of programmeEntries) {
  if (!programme.route || !programme.hero?.title || !programme.card || programme.details?.length !== 1) {
    throw new Error(`Programme record ${programme.id || "(unknown)"} is incomplete.`);
  }
}
const gallery = await readJson("gallery.json");
const homePage = await readJson("pages/index.json");
const aboutPage = await readJson("pages/about.json");

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

for (const programme of programmeEntries.filter(({ template }) => template === "foundation")) {
  await writeFile(
    resolve(outputDirectory, programme.route),
    renderProgrammePage(
      programme.hero,
      { ...programmeDetails(programme), chinese: programme.language === "zh-Hans", pageClass: programme.styleClass }
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
await writeFile(resolve(outputDirectory, "ba.html"), renderBaPage(programmes.get("ba").hero, programmeDetails(programmes.get("ba"))), "utf8");
await writeFile(resolve(outputDirectory, "dip.html"), renderDiplomaPage(programmes.get("diploma-en").hero, programmeDetails(programmes.get("diploma-en"))), "utf8");
await writeFile(resolve(outputDirectory, "ma.html"), renderMaPage(programmes.get("ma").hero, programmeDetails(programmes.get("ma"))), "utf8");

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
