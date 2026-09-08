const escapeAttribute = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

export const escapeHtml = (value = "") => escapeAttribute(value).replaceAll("'", "&#39;");

let siteShell = { navigation: [], footer: {} };

export function setSiteShell(site) {
  siteShell = site || siteShell;
}

export function renderSiteHeader() {
  const navigation = (siteShell.navigation || []).map((group, index) => {
    if (group.href) {
      return `<li class="revamp-nav-item"><a class="revamp-nav-link" href="${escapeAttribute(group.href)}">${escapeHtml(group.label)}</a></li>`;
    }

    const dropdownId = `revamp-nav-dropdown-${index}`;
    const children = (group.items || []).map((item) =>
      `<li><a href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a></li>`
    ).join("");
    return `<li class="revamp-nav-group"><button class="revamp-nav-trigger" type="button" aria-expanded="false" aria-controls="${dropdownId}">${escapeHtml(group.label)}<span aria-hidden="true">⌄</span></button><ul class="revamp-nav-dropdown" id="${dropdownId}">${children}</ul></li>`;
  }).join("");

  return `<header data-site-header>
    <a class="revamp-logo revamp-brand-link" href="index.html" aria-label="Buddhist and Pali College of Singapore home"><img src="images/bpclogo3x3b.png" alt="Buddhist and Pali College of Singapore Logo"><span class="revamp-brand-name"><span>Buddhist and Pali</span><span>College of Singapore</span></span></a>
    <button class="revamp-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">&#9776;</button>
    <ul id="menu"><li><ul class="submenu revamp-primary-nav">${navigation}</ul></li></ul>
  </header>`;
}

export function renderSiteFooter() {
  const footer = siteShell.footer || {};
  const social = (footer.social || []).map((item) =>
    `<a href="${escapeAttribute(item.href)}" rel="noreferrer" target="_blank" aria-label="${escapeAttribute(item.label)}"><i class="fa fa-${escapeAttribute(item.icon)}" aria-hidden="true"></i></a>`
  ).join("");
  return `<footer data-site-footer class="bpc-shared-footer"><p>${escapeHtml(footer.copyright || "")}</p><div class="bpc-shared-social">${social}</div></footer>`;
}

export function renderSitePage({
  title,
  description,
  body,
  language = "en",
  revampVersion = "20260830-home-emails",
  additionalHead = ""
}) {
  const safeTitle = escapeAttribute(title);
  const safeDescription = escapeAttribute(description);

  return `<!DOCTYPE html>
<html lang="${escapeAttribute(language)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BPC | ${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta property="og:title" content="BPC | ${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="images/bpclogo2x2a.png">
  <meta property="og:site_name" content="Buddhist and Pali College of Singapore">
  <meta property="og:type" content="website">
${additionalHead ? `  ${additionalHead}\n` : ""}  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-33Q9D4MNQF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-33Q9D4MNQF');
  </script>
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/revamp.css?v=${escapeAttribute(revampVersion)}">
</head>
<body>
  ${renderSiteHeader()}
${body}
  ${renderSiteFooter()}
  <script src="js/revamp.js?v=20260830-home-emails"></script>
</body>
</html>
`;
}
