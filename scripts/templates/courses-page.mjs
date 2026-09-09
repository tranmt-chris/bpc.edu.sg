import { escapeHtml, renderSitePage } from "./site-page.mjs";

const renderProgrammeCard = (reference, programmes) => {
  const programme = programmes.get(reference.programme);
  if (!programme) throw new Error(`Unknown programme: ${reference.programme}`);
  return `<a class="courses-modern-card" href="${escapeHtml(programme.route)}"${programme.language === "zh-Hans" ? ' lang="zh-Hans"' : ""}><div class="courses-modern-meta"><span>${escapeHtml(programme.card.level)}</span><span>${escapeHtml(programme.card.duration)}</span></div><h3>${escapeHtml(programme.hero.title)}</h3><p>${escapeHtml(programme.hero.lead)}</p><strong>${escapeHtml(programme.card.linkLabel)} <span aria-hidden="true">&rarr;</span></strong></a>`;
};

export function renderCoursesPage(programmeEntries, page) {
  const programmes = new Map(programmeEntries.map((programme) => [programme.id, programme]));
  const stages = page.stages.map((stage) => `<div class="courses-modern-stage" id="${escapeHtml(stage.id)}"><div class="courses-modern-stage-intro"><div class="courses-modern-stage-heading"><span>${escapeHtml(stage.number)}</span><div><p class="courses-modern-kicker">${escapeHtml(stage.kicker)}</p><h2>${escapeHtml(stage.title)}</h2></div></div><figure><img src="${escapeHtml(stage.image)}" alt="${escapeHtml(stage.imageAlt)}" width="960" height="640" loading="lazy" decoding="async"></figure></div><div class="courses-modern-grid">${stage.programmes.map((reference) => renderProgrammeCard(reference, programmes)).join("")}</div></div>`).join("");
  const comparisonHead = page.comparison.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const comparisonRows = page.comparison.rows.map((row) => `<tr><td>${escapeHtml(row.programme)}</td><td>${escapeHtml(row.duration)}</td><td>${escapeHtml(row.suitableFor)}</td></tr>`).join("");

  return renderSitePage({
    title: page.meta.title,
    description: page.meta.description,
    revampVersion: "20260813-courses-redesign",
    body: `  <main class="courses-modern">
    <section class="courses-modern-hero"><div class="courses-modern-shell"><p class="courses-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.lead)}</p></div></section>
    <section class="courses-modern-start"><div class="courses-modern-shell"><div class="courses-modern-start-card"><div><p class="courses-modern-kicker">${escapeHtml(page.start.kicker)}</p><h2>${escapeHtml(page.start.title)}</h2><p>${escapeHtml(page.start.description)}</p></div><a href="${escapeHtml(page.start.href)}">${escapeHtml(page.start.label)} <span aria-hidden="true">&rarr;</span></a></div></div></section>
    <section class="courses-modern-directory"><div class="courses-modern-shell">${stages}</div></section>
    <section class="courses-modern-compare"><div class="courses-modern-shell"><div class="courses-modern-section-heading"><p class="courses-modern-kicker">${escapeHtml(page.comparison.kicker)}</p><h2>${escapeHtml(page.comparison.title)}</h2></div><div class="courses-modern-table-wrap"><table><thead><tr>${comparisonHead}</tr></thead><tbody>${comparisonRows}</tbody></table></div></div></section>
    <section class="courses-modern-banner" aria-label="Programme banner"><div class="courses-modern-shell"><img src="${escapeHtml(page.banner.image)}" alt="${escapeHtml(page.banner.imageAlt)}" width="2048" height="878" loading="lazy" decoding="async"></div></section>
    <section class="courses-modern-guidance"><div class="courses-modern-shell"><div><p class="courses-modern-kicker">${escapeHtml(page.guidance.kicker)}</p><h2>${escapeHtml(page.guidance.title)}</h2></div><div><a class="courses-modern-primary" href="${escapeHtml(page.guidance.href)}">${escapeHtml(page.guidance.label)}</a></div></div></section>
  </main>`
  });
}
