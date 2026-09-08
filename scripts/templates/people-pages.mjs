import { escapeHtml, renderSitePage } from "./site-page.mjs";

const categoryNavigation = (categories, currentPage) => categories.map((category) =>
  `<a${category.page === currentPage ? ' class="active"' : ""} href="${escapeHtml(category.page)}">${escapeHtml(category.title)}</a>`
).join("");

const renderSocialLinks = (social = []) => social.length ? `<ul>${social.map((item) =>
  `<li><a href="${escapeHtml(item.href)}" rel="noreferrer" target="_blank" aria-label="${escapeHtml(item.label)}"><span class="fa fa-${escapeHtml(item.icon)}" aria-hidden="true"></span></a></li>`
).join("")}</ul>` : "";

const renderPerson = (person) => {
  const secondaryLines = [person.role, person.qualifications, person.details].filter(Boolean);
  const email = person.email
    ? `<br><a class="people-card-email" href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a>`
    : "";

  return `<article class="team-grid">
    <img src="${escapeHtml(person.image)}" class="img-fluid" alt="${escapeHtml(person.imageAlt || person.name)}" loading="lazy" decoding="async">
    <div class="caption"><div class="team-text"><h2>${escapeHtml(person.name)}${secondaryLines.map((line) => `<br>${escapeHtml(line)}`).join("")}${email}</h2></div>${renderSocialLinks(person.social)}</div>
  </article>`;
};

export function renderPeoplePages(peopleContent) {
  return Object.fromEntries(peopleContent.categories.map((category) => {
    const body = `  <main class="team he-codes">
    <section class="people-directory-hero"><div class="people-modern-shell">
      <a href="team.html">About / Our People</a>
      <p class="people-modern-kicker">Our People</p>
      <h1>${escapeHtml(category.title)}</h1>
      <nav class="people-category-nav" aria-label="Staff categories">${categoryNavigation(peopleContent.categories, category.page)}</nav>
    </div></section>
    <section class="team-cont text-center">
      <h3 class="title">${escapeHtml(category.title)}</h3>
      <div class="container"><div class="team-bottom">${category.people.map(renderPerson).join("\n")}</div>
      <div class="center-style"><a href="team.html" class="btn button-style">Back to Our People</a></div></div>
    </section>
  </main>`;

    return [category.page, renderSitePage({
      title: category.title,
      description: category.description,
      body
    })];
  }));
}
