import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

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
    "index.html": await readJson("pages/index.json")
  },
  gallery: await readJson("gallery.json")
};

await writeFile(
  resolve(root, "public/js/site-data.js"),
  `window.BPC_CONTENT = ${JSON.stringify(content, null, 2)};\n`,
  "utf8"
);

console.log("Generated public/js/site-data.js from structured content.");
