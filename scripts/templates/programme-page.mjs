import { escapeHtml, renderSitePage } from "./site-page.mjs";

const externalAttributes = (href = "") => /^https?:\/\//i.test(href) ? ' rel="noreferrer" target="_blank"' : "";
const renderLines = (lines = []) => lines.map(escapeHtml).join("<br>");
const renderSegments = (segments = []) => segments.map((segment) => segment.href
  ? `<a href="${escapeHtml(segment.href)}"${externalAttributes(segment.href)}>${escapeHtml(segment.text)}</a>`
  : escapeHtml(segment.text)
).join("");

export function renderProgrammePage(programme, detail) {
  const bodyClasses = ["programme-modern", detail.chinese ? "programme-modern-cn" : "", detail.pageClass || "", "he-codes"].filter(Boolean).join(" ");
  const factsClass = detail.facts.length === 2 ? " programme-modern-fact-grid-two" : "";
  const poster = detail.enrol.poster;
  const body = `  <main class="${bodyClasses}"${detail.chinese ? ' lang="zh-Hans"' : ""}>
    <section class="programme-modern-hero"><div class="programme-modern-shell programme-modern-hero-grid"><div>
      <a class="programme-modern-back" href="courses.html">${escapeHtml(detail.backLabel)}</a>
      <p class="programme-modern-kicker">${escapeHtml(programme.kicker)}</p><h1>${escapeHtml(programme.title)}</h1><p class="programme-modern-lead">${escapeHtml(programme.lead)}</p>
      <div class="programme-modern-actions"><a class="programme-modern-primary" href="${escapeHtml(programme.primary.href)}"${externalAttributes(programme.primary.href)}>${escapeHtml(programme.primary.label)}</a><a class="programme-modern-secondary" href="${escapeHtml(programme.secondary.href)}"${programme.secondary.download ? " download" : externalAttributes(programme.secondary.href)}>${escapeHtml(programme.secondary.label)}</a></div>
    </div><aside class="programme-modern-hero-note"><span>${escapeHtml(detail.heroNote.label)}</span><strong>${escapeHtml(detail.heroNote.value)}</strong>${detail.heroNote.lines?.length ? `<p>${renderLines(detail.heroNote.lines)}</p>` : ""}</aside></div></section>
    <section class="programme-modern-facts" aria-label="${escapeHtml(detail.factsLabel)}"><div class="programme-modern-shell programme-modern-fact-grid${factsClass}">${detail.facts.map((fact) => `<div><span>${escapeHtml(fact.label)}</span><strong>${escapeHtml(fact.value)}</strong></div>`).join("")}</div></section>
    <section class="programme-modern-body"><div class="programme-modern-shell programme-modern-content-grid"><div class="programme-modern-content">
      <p class="programme-modern-kicker">${escapeHtml(detail.overview.kicker)}</p><h2>${escapeHtml(detail.overview.title)}</h2>${(detail.overview.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      <div class="programme-modern-questions${detail.overview.requirements ? " programme-modern-requirements" : ""}">${(detail.overview.questions || []).map((question) => `<p>${escapeHtml(question)}</p>`).join("")}</div>
      <p class="programme-modern-kicker">${escapeHtml(detail.curriculum.kicker)}</p><h2>${escapeHtml(detail.curriculum.title)}</h2><ol class="programme-modern-curriculum${detail.curriculum.items.length === 5 ? " programme-modern-curriculum-five" : ""}">${detail.curriculum.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      <div class="programme-modern-next"><p class="programme-modern-kicker">${escapeHtml(detail.progression.kicker)}</p><h2>${escapeHtml(detail.progression.title)}</h2><p>${renderSegments(detail.progression.segments)}</p></div>
    </div><aside class="programme-modern-enrol">
      <p class="programme-modern-kicker">${escapeHtml(detail.enrol.kicker)}</p><h2>${escapeHtml(detail.enrol.title)}</h2>
      <a class="programme-modern-poster" href="${escapeHtml(poster.href || poster.image)}" target="_blank"><img src="${escapeHtml(poster.image)}" alt="${escapeHtml(poster.alt)}" loading="lazy" decoding="async"></a>
      <a class="programme-modern-primary" href="${escapeHtml(detail.enrol.button.href)}"${externalAttributes(detail.enrol.button.href)}>${escapeHtml(detail.enrol.button.label)}</a>
      <div class="programme-modern-enquiry"><span>${escapeHtml(detail.enrol.contactLabel)}</span>${detail.enrol.contacts.map((contact) => `<a href="${escapeHtml(contact.href)}"${externalAttributes(contact.href)}>${escapeHtml(contact.label)}</a>`).join("")}</div>
      <p class="programme-modern-location">${renderLines(detail.enrol.location)}</p>${detail.enrol.note ? `<p class="programme-modern-teacher">${escapeHtml(detail.enrol.note)}</p>` : ""}
    </aside></div></section>
  </main>`;

  return renderSitePage({
    title: programme.seo?.pageTitle || programme.title,
    description: programme.seo?.description || programme.lead,
    language: programme.language,
    body
  });
}
