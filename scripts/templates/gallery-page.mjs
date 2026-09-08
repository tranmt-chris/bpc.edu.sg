import { escapeHtml, renderSitePage } from "./site-page.mjs";

const renderEvent = (event, page) => {
  const alt = `${event.title}${event.date ? `, ${event.date}` : ""}`;
  return `<article class="gallery-modern-card"><a href="${escapeHtml(event.href)}" rel="noreferrer" target="_blank" aria-label="View ${escapeHtml(alt)}"><div class="gallery-modern-image"><img src="${escapeHtml(event.image)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"><span class="gallery-modern-view">${escapeHtml(page.albumLabel)} <i class="fa fa-external-link" aria-hidden="true"></i></span></div><div class="gallery-modern-card-copy"><h3>${escapeHtml(event.title)}</h3>${event.date ? `<time>${escapeHtml(event.date)}</time>` : `<span>${escapeHtml(page.archive.emptyDateLabel)}</span>`}</div></a></article>`;
};

export function renderGalleryPage(page) {
  const latestEvents = page.events.filter((event) => event.date && event.date.includes(page.latest.year));
  const archiveEvents = page.events.filter((event) => !event.date || !event.date.includes(page.latest.year));
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-gallery-content",
    body: `  <main class="gallery-modern"><section class="gallery-modern-hero"><div class="gallery-modern-shell"><p class="gallery-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section><section class="gallery-modern-content"><div class="gallery-modern-shell"><div class="gallery-modern-section-heading"><p class="gallery-modern-kicker">${escapeHtml(page.latest.kicker)}</p><h2>${escapeHtml(page.latest.title)}</h2></div><div class="gallery-modern-grid gallery-modern-grid-latest">${latestEvents.map((event) => renderEvent(event, page)).join("")}</div><div class="gallery-modern-section-heading gallery-modern-archive-heading"><p class="gallery-modern-kicker">${escapeHtml(page.archive.kicker)}</p><h2>${escapeHtml(page.archive.title)}</h2></div><div class="gallery-modern-grid">${archiveEvents.map((event) => renderEvent(event, page)).join("")}</div></div></section></main>`
  });
}
