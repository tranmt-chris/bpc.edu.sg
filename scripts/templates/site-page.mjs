const escapeAttribute = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

export const escapeHtml = (value = "") => escapeAttribute(value).replaceAll("'", "&#39;");

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
  <header data-site-header></header>
${body}
  <footer data-site-footer></footer>
  <script src="js/site-data.js?v=__SITE_DATA_VERSION__"></script>
  <script src="js/revamp.js?v=20260830-home-emails"></script>
</body>
</html>
`;
}
