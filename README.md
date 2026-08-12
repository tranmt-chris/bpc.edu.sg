# Buddhist and Pali College of Singapore website

This repository is the master source for the Buddhist and Pali College of
Singapore website. Make content changes here, preview them locally, and only
then publish a clean package to cPanel.

## Where to make changes

| Content | File or folder |
| --- | --- |
| Navigation, footer and social links | `public/content/site.json` |
| Programme summaries | `public/content/programmes.json` |
| Gallery events | `public/content/gallery.json` |
| Page-specific text | Relevant file in `public/` |
| Shared visual styles | `public/css/revamp.css` |
| Website images | `public/images/` |
| Contact form processing | `public/html_form_send.php` |

Do not edit `public/js/site-data.js` directly. After changing a file in
`public/content/`, regenerate it with:

```powershell
npm run build:content
```

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
2. In `public/alumni.html`, update both the cover-image link and the
   **Read e-Bulletin** button.
3. Confirm the Archive.org page opens.
4. Do not add the PDF to `public/ebulletin/`.

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
