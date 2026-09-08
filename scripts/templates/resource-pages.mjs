import { escapeHtml, renderSitePage } from "./site-page.mjs";

const external = (href = "") => /^https?:\/\//i.test(href) ? ' rel="noreferrer" target="_blank"' : "";

export function renderBooksPage(page) {
  const books = page.books.map((book, index) => `<article class="cart-grid" id="cart-${index + 1}"><div class="img"><img src="${escapeHtml(book.image)}" alt="${escapeHtml(book.title)}" loading="lazy" decoding="async"></div><h2 class="texts-modern-book-title">${escapeHtml(book.title)}</h2><ul class="info"><li>${escapeHtml(book.price)}</li></ul></article>`).join("");
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-resource-content",
    body: `  <main class="books he-codes texts-modern">
    <section class="texts-modern-hero"><div class="texts-modern-shell"><p class="texts-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section>
    <section class="books-cont"><div class="welcome-left"><div><div><p class="texts-modern-kicker">${escapeHtml(page.purchase.kicker)}</p><h2>${escapeHtml(page.purchase.title)}</h2><p>${escapeHtml(page.purchase.description)}</p></div><a class="texts-modern-contact" href="${escapeHtml(page.purchase.buttonHref)}"${external(page.purchase.buttonHref)}>${escapeHtml(page.purchase.buttonLabel)}</a></div></div>
      <div class="wthreeproductdisplay"><div class="container">${books}<div class="center-style"><a href="${escapeHtml(page.footerButton.href)}" class="btn button-style">${escapeHtml(page.footerButton.label)}</a></div></div></div>
    </section>
  </main>`
  });
}

export function renderElibraryPage(page) {
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-resource-content",
    body: `  <main class="resource-modern he-codes">
    <section class="resource-modern-hero"><div class="resource-modern-shell"><p class="resource-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section>
    <section class="resource-modern-body"><div class="resource-modern-shell resource-modern-card"><div class="resource-modern-copy"><p class="resource-modern-kicker">${escapeHtml(page.feature.kicker)}</p><h2>${escapeHtml(page.feature.title)}</h2><p>${escapeHtml(page.feature.description)}</p><a class="resource-modern-button" href="${escapeHtml(page.feature.buttonHref)}"${external(page.feature.buttonHref)}>${escapeHtml(page.feature.buttonLabel)} <span aria-hidden="true">↗</span></a></div><img class="resource-modern-image" src="${escapeHtml(page.feature.image)}" alt="${escapeHtml(page.feature.imageAlt)}" loading="lazy" decoding="async"></div><p class="resource-modern-credit">${escapeHtml(page.credit)}</p></section>
  </main>`
  });
}

export function renderPeopleOverviewPage(page) {
  const categories = page.categories.map((category) => `<div class="col-lg-4 serv-w3mk"><article class="w3pvtits-services-grids"><span class="fa fa-${escapeHtml(category.icon)} ser-icon" aria-hidden="true"></span><h4 class="text-bl">${escapeHtml(category.title)}</h4><a class="service-btn btn" href="${escapeHtml(category.href)}">${escapeHtml(category.buttonLabel)} <span class="fa fa-long-arrow-right" aria-hidden="true"></span></a></article></div>`).join("");
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-resource-content",
    body: `  <main class="people-modern staff" id="staff">
    <section class="people-modern-hero"><div class="people-modern-shell"><p class="people-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section>
    <section class="people-modern-landing"><div class="people-modern-shell"><div class="row text-center people-modern-category-grid">${categories}</div><section class="people-modern-feature" aria-labelledby="staff-convocation-title"><figure class="people-modern-feature-photo"><img src="${escapeHtml(page.feature.image)}" alt="${escapeHtml(page.feature.imageAlt)}" width="2200" height="820" loading="lazy" decoding="async"><figcaption class="people-modern-feature-heading"><h2 id="staff-convocation-title">${escapeHtml(page.feature.title)}</h2><time datetime="${escapeHtml(page.feature.dateTime)}">${escapeHtml(page.feature.date)}</time></figcaption></figure></section></div></section>
  </main>`
  });
}
