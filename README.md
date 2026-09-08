# Buddhist and Pali College of Singapore website

This repository is the master source for the Buddhist and Pali College of
Singapore website. Make content changes here, preview them locally, and only
then publish a clean package to cPanel.

## Where to make changes

| Content | File or folder |
| --- | --- |
| Navigation, footer and social links | `public/content/site.json` |
| Programme summaries | `public/content/programmes.json` |
| Introduction and Chinese Diploma page details | `public/content/pages/intro.json`, `introc.json`, `dipc.json` |
| All Courses page | `public/content/pages/courses.json` |
| Key dates, timetables and contacts | `public/content/key-dates.json` |
| Recommended Texts | `public/content/books.json` |
| eLibrary | `public/content/elibrary.json` |
| Our People overview | `public/content/people-overview.json` |
| Contact form and details | `public/content/contact.json` |
| Contact confirmation page | `public/content/thank-you.json` |
| Homepage and About page | `public/content/pages/index.json`, `about.json` |
| Diploma, BA and MA pages | `public/content/programmes.json`, plus `public/content/pages/dip.json`, `ba.json`, `ma.json` |
| Gallery page and events | `public/content/gallery.json` |
| Academic, administrative and visiting staff | `public/content/people.json` |
| Alumni page and e-Bulletins | `public/content/bulletins.json` |
| Page-specific text | Relevant file in `public/` |
| Shared visual styles | `public/css/revamp.css` |
| Website images | `public/images/` |
| Contact form service | FormSubmit (`https://formsubmit.co`) |

Do not edit `public/js/site-data.js`, `public/alumni.html`, the three staff HTML
pages, `public/intro.html`, `public/introc.html`, `public/dip.html`, `public/dipc.html`,
`public/ba.html`, `public/ma.html`,
`public/courses.html`, `public/key.html`, `public/books.html`,
`public/elibrary.html`, `public/team.html`, `public/contact.html` or
`public/thank-you.html`, `public/gallery.html`, `public/index.html` or
`public/about.html` directly. They are generated from
structured content. After changing a file in `public/content/`, regenerate the website with:

```powershell
npm run build:content
```

## Edit shared content with Pages CMS

The repository includes `.pages.yml` for editing navigation, footer details,
programme summaries, structured programme and course pages, Key Dates,
Homepage, About, Diploma, BA and MA forms, staff directories, the Alumni page,
e-Bulletins, the remaining individual HTML pages, gallery events, images and documents through
[Pages CMS](https://app.pagescms.org/).

1. Sign in to Pages CMS with GitHub.
2. Install the Pages CMS GitHub App for this repository only.
3. Open the repository and select the `main` branch.
4. Edit an item and save it. Pages CMS commits the changed content file to GitHub.
5. The GitHub Pages workflow regenerates `public/js/site-data.js` and publishes
   the updated preview automatically.

After a Pages CMS update, run `git pull` before making further local edits.

## Preview locally

From the repository folder, run:

```powershell
python -m http.server 5173 --bind 127.0.0.1 --directory public
```

Then open <http://127.0.0.1:5173/>. Stop the preview with `Ctrl+C`.

Before publishing, check the changed pages on desktop and mobile, navigation,
footer placement, images, registration links, external links and the contact
form layout.

## Add an eBulletin

1. Upload the PDF to Archive.org.
2. Open **Alumni and e-Bulletins** in Pages CMS.
3. Add an item to **e-Bulletins**, including its title, date, summary, cover
   image and Archive.org link.
4. Save the entry and allow the GitHub workflow to regenerate `alumni.html`.
5. Confirm the Archive.org page opens. Do not add the PDF to
   `public/ebulletin/`.

## Update staff directories

Open **Our People → Staff directories** in Pages CMS. Add, remove or reorder a
person inside Academic Staff, Administrative Staff or Visiting Lecturers. The
three staff HTML pages are regenerated automatically after saving.

## Add a gallery event

1. Optimize the thumbnail for the web and place it in `public/images/`.
2. Add the event to `public/content/gallery.json`.
3. Run `npm run build:content`.
4. Preview `gallery.html` on desktop and mobile.

## Create the cPanel deployment package

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-cpanel-package.ps1
```

The script creates a dated ZIP in `output/`. It includes only files needed by
the website, retains locally referenced documents, and excludes source files,
build tools, temporary files and unreferenced eBulletin PDFs.

Upload the ZIP to the intended cPanel directory and extract it there. Test in a
preview directory before replacing the live website.

## Routine update workflow

1. Pull the latest changes from GitHub.
2. Edit the local source.
3. Regenerate shared content when JSON files change.
4. Preview and test locally.
5. Commit and push the change to GitHub.
6. Build a clean cPanel ZIP.
7. Upload and test it in the cPanel preview directory.
8. Promote the approved version to the live site.

Never store mailbox passwords, SFTP credentials, API keys or other secrets in
this repository.
