import { escapeHtml, renderSitePage } from "./site-page.mjs";

const renderBulletin = (bulletin, index) => {
  const year = bulletin.dateLabel.match(/20\d{2}/)?.[0] || "Older";
  return `<article class="alumni-modern-item${index === 0 ? " alumni-modern-featured" : ""}" data-year="${year}">
  <div class="card border-0 med-blog alumni-modern-card">
    <div class="card-header p-0"><a href="${escapeHtml(bulletin.href)}" rel="noreferrer" target="_blank"><img class="card-img-bottom" src="${escapeHtml(bulletin.image)}" alt="${escapeHtml(bulletin.imageAlt)}" loading="lazy" decoding="async"></a></div>
    <div class="card-body">
      <div class="mb-3"><h2 class="blog-title card-title font-weight-bold m-0"><a href="${escapeHtml(bulletin.href)}" rel="noreferrer" target="_blank">${escapeHtml(bulletin.title)}</a></h2><div class="blog_mobiicon"><span>${escapeHtml(bulletin.dateLabel)}</span></div></div>
      <p class="mb-4">${escapeHtml(bulletin.description)}</p>
      <a href="${escapeHtml(bulletin.href)}" rel="noreferrer" target="_blank" class="blog-btn btn">${escapeHtml(bulletin.buttonLabel || "Read e-Bulletin")}</a>
    </div>
  </div>
</article>`;
};

export function renderAlumniPage(content) {
  const hero = content.hero;
  const community = content.community;
  const archive = content.archive;
  const body = `  <main class="alumni-modern">
    <section class="alumni-modern-hero"><div class="alumni-modern-shell">
      <p class="alumni-modern-kicker">${escapeHtml(hero.kicker)}</p>
      <h1>${escapeHtml(hero.title)}</h1>
      <p>${escapeHtml(hero.description)}</p>
    </div></section>
    <section class="alumni-community" aria-labelledby="alumni-community-title"><div class="alumni-modern-shell"><div class="alumni-community-card">
      <div class="alumni-community-icon" aria-hidden="true"><i class="fa fa-whatsapp"></i></div>
      <div class="alumni-community-copy"><p class="alumni-community-kicker">${escapeHtml(community.kicker)}</p><h2 id="alumni-community-title">${escapeHtml(community.title)}</h2><p>${escapeHtml(community.description)}</p><p class="alumni-community-note">${escapeHtml(community.note)}</p></div>
      <a class="alumni-community-button" href="${escapeHtml(community.button.href)}"><span>${escapeHtml(community.button.label)}</span><strong>${escapeHtml(community.button.detail)}</strong><i class="fa fa-arrow-right" aria-hidden="true"></i></a>
    </div></div></section>
    <section class="alumni-modern-content"><div class="alumni-modern-shell">
      <div class="alumni-modern-heading"><div><p class="alumni-modern-kicker">${escapeHtml(archive.kicker)}</p><h2>${escapeHtml(archive.title)}</h2></div><div class="alumni-modern-filters" data-alumni-filters aria-label="Filter e-Bulletins by year"></div></div>
      <div class="alumni-modern-grid" data-alumni-grid>${content.bulletins.map(renderBulletin).join("\n")}</div>
    </div></section>
  </main>`;

  return renderSitePage({
    title: hero.pageTitle,
    description: hero.metaDescription,
    body,
    revampVersion: "20260830-alumni-community"
  });
}
