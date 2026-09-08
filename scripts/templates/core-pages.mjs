import { escapeHtml, renderSitePage } from "./site-page.mjs";

const external = (href = "") => /^https?:\/\//i.test(href) ? ' rel="noreferrer" target="_blank"' : "";

export function renderHomePage(page, latestEvent) {
  const hero = page.hero;
  const pathways = page.pathways.items.map((item, index) => `<a class="home-modern-pathway" href="${escapeHtml(item.href)}"><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><strong>${escapeHtml(item.linkLabel)} <span aria-hidden="true">&rarr;</span></strong></div></a>`).join("");
  const emails = page.contact.emails.slice(0, 2).map((email) => `<a href="${escapeHtml(email.href)}">${escapeHtml(email.label)}</a>`).join("");
  const latestAlt = `${latestEvent.title}${latestEvent.date ? `, ${latestEvent.date}` : ""}`;
  const latestCard = `<a class="home-modern-event" href="${escapeHtml(latestEvent.href)}"${external(latestEvent.href)}><div class="home-modern-event-image"><img src="${escapeHtml(latestEvent.image)}" alt="${escapeHtml(latestAlt)}" loading="lazy" decoding="async"></div><div class="home-modern-event-copy"><p class="home-modern-kicker">Recent highlight</p><h3>${escapeHtml(latestEvent.title)}</h3>${latestEvent.date ? `<time>${escapeHtml(latestEvent.date)}</time>` : ""}<span>View event album <i class="fa fa-external-link" aria-hidden="true"></i></span></div></a>`;
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-core-content",
    body: `  <section class="banner_mobilspvt he-codes"><div class="container-fluid"><div class="banner-text pl-lg-5 pl-sm-4 ml-lg-3"><div class="logo-2"><a href="index.html"><img src="${escapeHtml(hero.logo)}" width="180" height="180" alt="${escapeHtml(hero.logoAlt)}"></a></div><h1 class="my-md-4 my-3">${escapeHtml(hero.title)}</h1><h2>${escapeHtml(hero.lead)}</h2><br><a href="${escapeHtml(hero.primary.href)}" class="btn button-style mt-5">${escapeHtml(hero.primary.label)}</a><a href="${escapeHtml(hero.secondary.href)}" class="btn button-style mt-5">${escapeHtml(hero.secondary.label)}</a></div></div></section>
  <main class="home-modern"><section class="home-modern-pathways"><div class="home-modern-shell"><div class="home-modern-heading"><div><p class="home-modern-kicker">${escapeHtml(page.pathways.kicker)}</p><h2>${escapeHtml(page.pathways.title)}</h2></div><a href="${escapeHtml(page.pathways.allCourses.href)}">${escapeHtml(page.pathways.allCourses.label)} <span aria-hidden="true">&rarr;</span></a></div><div class="home-modern-pathway-grid">${pathways}</div></div></section>
    <section class="home-modern-about"><div class="home-modern-shell home-modern-about-grid"><figure><img src="${escapeHtml(page.about.image)}" alt="${escapeHtml(page.about.imageAlt)}" loading="lazy" decoding="async"></figure><div><p class="home-modern-kicker">${escapeHtml(page.about.kicker)}</p><h2>${escapeHtml(page.about.title)}</h2><p>${escapeHtml(page.about.description)}</p><a class="home-modern-button" href="${escapeHtml(page.about.button.href)}">${escapeHtml(page.about.button.label)}</a></div></div></section>
    <section class="home-modern-latest"><div class="home-modern-shell"><div class="home-modern-heading"><div><p class="home-modern-kicker">${escapeHtml(page.latest.kicker)}</p><h2>${escapeHtml(page.latest.title)}</h2></div><a href="${escapeHtml(page.latest.button.href)}">${escapeHtml(page.latest.button.label)} <span aria-hidden="true">&rarr;</span></a></div>${latestCard}</div></section>
    <section class="home-modern-contact" aria-label="College location and contact details"><div class="home-modern-shell home-modern-contact-grid"><div><span>${escapeHtml(page.contact.addressLabel)}</span><strong>${escapeHtml(page.contact.address)}</strong></div><div><span>${escapeHtml(page.contact.phoneLabel)}</span><a href="${escapeHtml(page.contact.phoneHref)}">${escapeHtml(page.contact.phone)}</a></div><div><span>${escapeHtml(page.contact.emailLabel)}</span>${emails}</div><a class="home-modern-contact-link" href="${escapeHtml(page.contact.button.href)}">${escapeHtml(page.contact.button.label)} <span aria-hidden="true">&rarr;</span></a></div></section>
  </main>`
  });
}

export function renderAboutPage(page) {
  const facts = page.facts.map((fact) => `<article><strong>${escapeHtml(fact.value)}</strong><span>${escapeHtml(fact.label)}</span></article>`).join("");
  const leaders = page.leadership.people.map((person) => `<article><img src="${escapeHtml(person.image)}" alt="${escapeHtml(person.imageAlt || person.name)}" loading="lazy" decoding="async"><div><span>${escapeHtml(person.role)}</span><h3>${escapeHtml(person.name)}</h3>${person.qualification ? `<p>${escapeHtml(person.qualification)}</p>` : ""}</div></article>`).join("");
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-core-content",
    body: `  <main class="about-modern"><section class="about-modern-hero"><div class="about-modern-shell about-modern-hero-grid"><div class="about-modern-intro"><p class="about-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p class="about-modern-lead">${escapeHtml(page.hero.lead)}</p></div><figure class="about-modern-feature"><img src="${escapeHtml(page.hero.image)}" alt="${escapeHtml(page.hero.imageAlt)}" fetchpriority="high"></figure></div></section>
    <section class="about-modern-story"><div class="about-modern-shell about-modern-story-grid"><div><p class="about-modern-kicker">${escapeHtml(page.story.kicker)}</p><h2>${escapeHtml(page.story.title)}</h2></div><div class="about-modern-copy">${page.story.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div></div></section>
    <section class="about-modern-facts" aria-label="College facts"><div class="about-modern-shell about-modern-fact-grid">${facts}</div></section>
    <section class="about-modern-leadership"><div class="about-modern-shell"><p class="about-modern-kicker">${escapeHtml(page.leadership.kicker)}</p><h2>${escapeHtml(page.leadership.title)}</h2><div class="about-modern-leader-grid">${leaders}</div></div></section>
    <section class="about-modern-gallery" aria-label="College gallery"><div class="about-modern-shell about-modern-gallery-grid"><img src="${escapeHtml(page.gallery.image)}" alt="${escapeHtml(page.gallery.imageAlt)}" loading="lazy" decoding="async"></div></section>
    <section class="about-modern-cta"><div class="about-modern-shell"><div><p class="about-modern-kicker">${escapeHtml(page.cta.kicker)}</p><h2>${escapeHtml(page.cta.title)}</h2></div><a href="${escapeHtml(page.cta.button.href)}">${escapeHtml(page.cta.button.label)}</a></div></section>
  </main>`
  });
}
