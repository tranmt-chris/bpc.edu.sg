import { readdir, readFile, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceContent = resolve(root, "public/content");
const checkDirectory = resolve(root, ".site-check");
const expectedPages = [
  "about.html", "alumni.html", "ba.html", "bc.html", "books.html", "contact.html",
  "courses.html", "dip.html", "dipc.html", "elibrary.html", "gallery.html", "index.html",
  "intro.html", "introc.html", "key.html", "ma.html", "team.html", "teamac.html",
  "teamnac.html", "teamvisit.html", "thank-you.html", "visit.html"
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }))).flat();
}

function isLocalUrl(value) {
  return value && !/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function runBuild() {
  return new Promise((resolveBuild, reject) => {
    const child = spawn(process.execPath, ["scripts/build-content.mjs", "--output", ".site-check"], {
      cwd: root,
      stdio: "inherit"
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolveBuild() : reject(new Error(`Build exited with ${code}.`)));
  });
}

const errors = [];
try {
  for (const file of await walk(sourceContent)) {
    if (file.endsWith(".json")) {
      try {
        JSON.parse(await readFile(file, "utf8"));
      } catch (error) {
        errors.push(`Invalid JSON: ${file.replace(root + "\\", "")} (${error.message})`);
      }
    }
  }

  if (errors.length === 0) await runBuild();

  for (const page of expectedPages) {
    try {
      await stat(resolve(checkDirectory, page));
    } catch {
      errors.push(`Missing generated page: ${page}`);
    }
  }

  for (const page of expectedPages) {
    try {
      const html = await readFile(resolve(checkDirectory, page), "utf8");
      for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = match[1].split(/[?#]/, 1)[0];
        if (isLocalUrl(url)) {
          try {
            await stat(resolve(checkDirectory, url));
          } catch {
            errors.push(`${page} references a missing local file: ${url}`);
          }
        }
      }
    } catch {
      // The missing-page check above reports this more clearly.
    }
  }
} finally {
  await rm(checkDirectory, { recursive: true, force: true });
}

if (errors.length) throw new Error(`Site validation failed:\n- ${errors.join("\n- ")}`);

console.log(`Validated ${expectedPages.length} generated pages, local links, and CMS JSON.`);
