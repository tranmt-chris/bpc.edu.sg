import { escapeHtml, renderSitePage } from "./site-page.mjs";

const renderList = (items) => items.length ? `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : `<span aria-label="No class">—</span>`;

export function renderKeyDatesPage(page) {
  const calendarRows = page.calendar.sections.map((section) => `<tr class="key-group-row"><th colspan="2">${escapeHtml(section.title)}</th></tr>${section.rows.map((row) => `<tr><td>${escapeHtml(row.activity)}</td><td>${escapeHtml(row.date)}</td></tr>`).join("")}`).join("");
  const classes = page.timetable.classes.map((course) => `<article class="key-class-card"><h3>${escapeHtml(course.title)}</h3><div class="key-table-scroll"><table><thead><tr>${course.columns.map((column) => `<th>${escapeHtml(column.heading)}</th>`).join("")}</tr></thead><tbody><tr>${course.columns.map((column) => `<td>${renderList(column.items)}</td>`).join("")}</tr></tbody></table></div></article>`).join("");
  const lecturers = page.lecturers.items.map((item) => `<tr><td><strong>${escapeHtml(item.initial)}</strong></td><td>${escapeHtml(item.lecturer)}</td></tr>`).join("");
  const administrators = page.administration.items.map((person) => `<article class="key-contact-card"><h3>${escapeHtml(person.name)}</h3><p>${escapeHtml(person.role)}</p><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a><a href="tel:+65${escapeHtml(person.phone)}">${escapeHtml(person.phone)}</a></article>`).join("");

  return renderSitePage({
    title: page.meta.title,
    description: page.meta.description,
    revampVersion: "20260908-key-content",
    body: `  <main class="key-modern he-codes">
    <section class="key-modern-hero"><div class="key-modern-shell"><p class="programme-modern-kicker">Student information</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.lead)}</p></div></section>
    <section class="key-modern-section"><div class="key-modern-shell"><h2>${escapeHtml(page.calendar.title)}</h2><div class="key-table-scroll"><table><thead><tr>${page.calendar.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${calendarRows}</tbody></table></div><p class="key-note">${escapeHtml(page.calendar.note)}</p></div></section>
    <section class="key-modern-section key-modern-section-tint"><div class="key-modern-shell"><h2>${escapeHtml(page.timetable.title)}</h2><div class="key-class-grid">${classes}</div></div></section>
    <section class="key-modern-section"><div class="key-modern-shell"><h2>${escapeHtml(page.lecturers.title)}</h2><div class="key-table-scroll"><table><thead><tr>${page.lecturers.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${lecturers}</tbody></table></div></div></section>
    <section class="key-modern-section key-modern-section-tint"><div class="key-modern-shell"><h2>${escapeHtml(page.administration.title)}</h2><div class="key-contact-grid">${administrators}</div></div></section>
  </main>`
  });
}
