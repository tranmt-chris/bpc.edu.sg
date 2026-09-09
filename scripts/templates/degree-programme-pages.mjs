import { escapeHtml, renderSitePage } from "./site-page.mjs";

const externalAttributes = (href = "") => /^https?:\/\//i.test(href) ? ' rel="noreferrer" target="_blank"' : "";
const renderLines = (values = []) => values.map(escapeHtml).join("<br>");
const renderFacts = (facts = []) => facts.map((fact) => `<div><span>${escapeHtml(fact.label)}</span><strong>${escapeHtml(fact.value)}</strong></div>`).join("");
const renderHeroNote = (note = {}) => `<aside class="programme-modern-hero-note"><span>${escapeHtml(note.label)}</span><strong>${escapeHtml(note.value)}</strong>${note.lines?.length ? `<p>${renderLines(note.lines)}</p>` : ""}</aside>`;

function renderHero(programme, note) {
  return `<section class="programme-modern-hero"><div class="programme-modern-shell programme-modern-hero-grid"><div><a class="programme-modern-back" href="courses.html">All Courses</a><p class="programme-modern-kicker">${escapeHtml(programme.kicker)}</p><h1>${escapeHtml(programme.title)}</h1><p class="programme-modern-lead">${escapeHtml(programme.lead)}</p><div class="programme-modern-actions"><a class="programme-modern-primary" href="${escapeHtml(programme.primary.href)}"${externalAttributes(programme.primary.href)}>${escapeHtml(programme.primary.label)}</a><a class="programme-modern-secondary" href="${escapeHtml(programme.secondary.href)}"${externalAttributes(programme.secondary.href) || ' target="_blank"'}>${escapeHtml(programme.secondary.label)}</a></div></div>${renderHeroNote(note)}</div></section>`;
}

function renderAdmissions(admissions = {}) {
  const poster = admissions.poster || {};
  const posterHtml = poster.image ? `<a class="programme-modern-poster" href="${escapeHtml(poster.href || poster.image)}" target="_blank"><img src="${escapeHtml(poster.image)}" alt="${escapeHtml(poster.alt)}" loading="lazy" decoding="async"></a>` : "";
  return `<aside class="programme-modern-enrol"><p class="programme-modern-kicker">${escapeHtml(admissions.kicker)}</p><h2>${escapeHtml(admissions.title)}</h2>${posterHtml}<a class="programme-modern-primary" href="${escapeHtml(admissions.button?.href)}"${externalAttributes(admissions.button?.href)}>${escapeHtml(admissions.button?.label)}</a><div class="programme-modern-enquiry"><span>${escapeHtml(admissions.contactLabel)}</span>${(admissions.contacts || []).map((contact) => `<a href="${escapeHtml(contact.href)}"${externalAttributes(contact.href)}>${escapeHtml(contact.label)}</a>`).join("")}</div><p class="programme-modern-location">${renderLines(admissions.location)}</p>${admissions.note ? `<p class="programme-modern-teacher">${escapeHtml(admissions.note)}</p>` : ""}</aside>`;
}

const renderPage = (programme, body, pageClass) => renderSitePage({
  title: programme.title,
  description: programme.lead,
  language: programme.language,
  body: `  <main class="programme-modern ${pageClass} he-codes">${body}</main>`
});

export function renderBaPage(programme, page) {
  const eligibility = page.eligibility || {};
  const structure = page.structure || {};
  const progression = page.progression || {};
  const content = `<p class="programme-modern-kicker">${escapeHtml(eligibility.kicker)}</p><h2>${escapeHtml(eligibility.title)}</h2><p>${escapeHtml(eligibility.prefix)} <a href="${escapeHtml(eligibility.link?.href)}">${escapeHtml(eligibility.link?.label)}</a> ${escapeHtml(eligibility.suffix)}</p><div class="programme-modern-questions programme-modern-requirements">${(eligibility.requirements || []).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div><p class="programme-modern-kicker">${escapeHtml(structure.kicker)}</p><h2>${escapeHtml(structure.title)}</h2><div class="programme-modern-year-grid">${(structure.years || []).map((year) => `<article><span>${escapeHtml(year.label)}</span><h3>${escapeHtml(year.title)}</h3><p>${escapeHtml(year.description)}</p></article>`).join("")}</div><div class="programme-modern-next"><p class="programme-modern-kicker">${escapeHtml(progression.kicker)}</p><h2>${escapeHtml(progression.title)}</h2><p>${escapeHtml(progression.prefix)} <a href="${escapeHtml(progression.link?.href)}">${escapeHtml(progression.link?.label)}</a>.</p></div>`;
  const body = `${renderHero(programme, page.heroNote)}<section class="programme-modern-facts"><div class="programme-modern-shell programme-modern-fact-grid">${renderFacts(page.facts)}</div></section><section class="programme-modern-body"><div class="programme-modern-shell programme-modern-content-grid"><div class="programme-modern-content">${content}</div>${renderAdmissions(page.admissions)}</div></section>`;
  return renderPage(programme, body, "programme-modern-ba");
}

export function renderDiplomaPage(programme, page) {
  const overview = page.overview || {};
  const curriculum = page.curriculum || {};
  const venues = page.venues || {};
  const progression = page.progression || {};
  const registration = page.registration || {};
  const venueCards = (venues.items || []).map((venue, index) => `<article><span>${escapeHtml(venue.label)}</span><img class="programme-modern-venue-image${index === 1 ? " programme-modern-venue-image-pohming" : ""}" src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.imageAlt || venue.name)}" loading="lazy" decoding="async"><h3>${escapeHtml(venue.name)}</h3><p>${renderLines(venue.address)}</p><ul>${(venue.schedule || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><strong>${escapeHtml(venue.commences)}</strong></article>`).join("");
  const content = `<p class="programme-modern-kicker">${escapeHtml(overview.kicker)}</p><h2>${escapeHtml(overview.title)}</h2><p>${escapeHtml(overview.description)}</p><div class="programme-modern-questions programme-modern-requirements">${(overview.eligibility || []).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div><p class="programme-modern-kicker">${escapeHtml(curriculum.kicker)}</p><h2>${escapeHtml(curriculum.title)}</h2><ol class="programme-modern-curriculum programme-modern-curriculum-five">${(curriculum.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><p class="programme-modern-kicker">${escapeHtml(venues.kicker)}</p><h2>${escapeHtml(venues.title)}</h2><div class="programme-modern-venue-grid">${venueCards}</div><div class="programme-modern-next"><p class="programme-modern-kicker">${escapeHtml(progression.kicker)}</p><h2>${escapeHtml(progression.title)}</h2><p>${escapeHtml(progression.prefix)} <a href="${escapeHtml(progression.ba?.href)}">${escapeHtml(progression.ba?.label)}</a>, ${escapeHtml(progression.between)} <a href="${escapeHtml(progression.ma?.href)}">${escapeHtml(progression.ma?.label)}</a>.</p></div>`;
  const poster = registration.poster || {};
  const options = (registration.options || []).map((option) => `<div class="programme-modern-registration-option"><span>${escapeHtml(option.label)}</span><h3>${escapeHtml(option.title)}</h3><p>${escapeHtml(option.description)}</p>${(option.dates || []).map((date) => `<div class="programme-modern-preview-date"><span>${escapeHtml(date.venue)}</span><strong>${escapeHtml(date.date)}</strong><p>${escapeHtml(date.time)}</p></div>`).join("")}${option.button ? `<a class="programme-modern-primary" href="${escapeHtml(option.button.href)}"${externalAttributes(option.button.href)}>${escapeHtml(option.button.label)}</a>` : ""}${option.contact ? `<a class="programme-modern-registration-contact" href="${escapeHtml(option.contact.href)}"${externalAttributes(option.contact.href)}>${escapeHtml(option.contact.label)}</a>` : ""}</div>`).join("");
  const enquiry = registration.enquiry || {};
  const registrationPanel = `<aside class="programme-modern-enrol programme-modern-preview"><p class="programme-modern-kicker">${escapeHtml(registration.kicker)}</p><h2>${escapeHtml(registration.title)}</h2><a class="programme-modern-poster" href="${escapeHtml(poster.href || poster.image)}" target="_blank"><img src="${escapeHtml(poster.image)}" alt="${escapeHtml(poster.alt)}" loading="lazy" decoding="async"></a>${options}<div class="programme-modern-enquiry"><span>${escapeHtml(enquiry.label)}</span><a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a><a href="${escapeHtml(enquiry.phone)}"${externalAttributes(enquiry.phone)}>${escapeHtml(enquiry.contactName)} · ${escapeHtml(enquiry.phoneDisplay)}</a></div><p class="programme-modern-teacher">${escapeHtml(registration.note)}</p></aside>`;
  const body = `${renderHero(programme, page.heroNote)}<section class="programme-modern-facts" aria-label="Course details"><div class="programme-modern-shell programme-modern-fact-grid">${renderFacts(page.facts)}</div></section><section class="programme-modern-body"><div class="programme-modern-shell programme-modern-content-grid"><div class="programme-modern-content">${content}</div>${registrationPanel}</div></section>`;
  return renderPage(programme, body, "programme-modern-diploma");
}

export function renderMaPage(programme, page) {
  const eligibility = page.eligibility || {};
  const curriculum = page.curriculum || {};
  const assessment = page.assessment || {};
  const content = `<p class="programme-modern-kicker">${escapeHtml(eligibility.kicker)}</p><h2>${escapeHtml(eligibility.title)}</h2><p>${escapeHtml(eligibility.prefix)} <a href="${escapeHtml(eligibility.link?.href)}">${escapeHtml(eligibility.link?.label)}</a> ${escapeHtml(eligibility.suffix)}</p><p class="programme-modern-kicker">${escapeHtml(curriculum.kicker)}</p><h2>${escapeHtml(curriculum.title)}</h2><ol class="programme-modern-curriculum">${(curriculum.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><div class="programme-modern-next"><p class="programme-modern-kicker">${escapeHtml(assessment.kicker)}</p><h2>${escapeHtml(assessment.title)}</h2><p>${escapeHtml(assessment.description)}</p></div>`;
  const body = `${renderHero(programme, page.heroNote)}<section class="programme-modern-facts"><div class="programme-modern-shell programme-modern-fact-grid">${renderFacts(page.facts)}</div></section><section class="programme-modern-body"><div class="programme-modern-shell programme-modern-content-grid"><div class="programme-modern-content">${content}</div>${renderAdmissions(page.admissions)}</div></section>`;
  return renderPage(programme, body, "programme-modern-ma");
}
