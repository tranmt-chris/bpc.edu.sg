import { escapeHtml, renderSitePage } from "./site-page.mjs";

const lines = (items = []) => items.map(escapeHtml).join("<br>");

export function renderContactPage(page) {
  const subjects = page.form.subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join("");
  const emails = page.details.emails.map((email) => `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`).join("");
  const phoneHref = page.details.phone.replace(/[^+\d]/g, "");
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    revampVersion: "20260908-contact-content",
    body: `  <main class="contact-modern he-codes">
    <section class="contact-modern-hero" id="contact-us"><div class="contact-modern-shell"><p class="contact-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section>
    <section class="contact-modern-main"><div class="contact-modern-shell contact-modern-grid"><div class="contact-modern-form-card"><p class="contact-modern-kicker">${escapeHtml(page.form.kicker)}</p><h2>${escapeHtml(page.form.title)}</h2>
      <form action="${escapeHtml(page.form.action)}" method="post"><div class="contact-form-website" aria-hidden="true"><label for="contact-website">Leave this field empty</label><input id="contact-website" type="text" name="_honey" tabindex="-1" autocomplete="off"></div><input type="hidden" name="_next" value="${escapeHtml(page.form.redirect)}">
        <div class="contact-modern-field"><label for="contact-subject">${escapeHtml(page.form.subjectLabel)}</label><select id="contact-subject" name="_subject">${subjects}</select></div>
        <div class="contact-modern-field"><label for="contact-name">${escapeHtml(page.form.nameLabel)}</label><input id="contact-name" type="text" name="Name" autocomplete="name" required></div>
        <div class="contact-modern-field"><label for="contact-email">${escapeHtml(page.form.emailLabel)}</label><input id="contact-email" type="email" name="email" autocomplete="email" required></div>
        <div class="contact-modern-field"><label for="contact-message">${escapeHtml(page.form.messageLabel)}</label><textarea id="contact-message" name="Message" rows="6" required></textarea></div><button type="submit" class="contact-modern-submit">${escapeHtml(page.form.buttonLabel)}</button>
      </form></div>
      <aside class="contact-modern-details" aria-label="College contact details"><p class="contact-modern-kicker">${escapeHtml(page.details.kicker)}</p><h2>${escapeHtml(page.details.title)}</h2><figure class="contact-modern-temple-photo"><img src="${escapeHtml(page.details.image)}" alt="${escapeHtml(page.details.imageAlt)}" width="1672" height="941" loading="lazy" decoding="async"></figure><div class="contact-modern-detail"><span>${escapeHtml(page.details.addressLabel)}</span><p>${lines(page.details.address)}</p></div><div class="contact-modern-detail"><span>${escapeHtml(page.details.emailLabel)}</span>${emails}</div><div class="contact-modern-detail"><span>${escapeHtml(page.details.phoneLabel)}</span><a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(page.details.phone)}</a></div><a class="contact-modern-visit-link" href="#visit-us">${escapeHtml(page.details.visitLabel)}</a></aside>
    </div></section>
    <section class="contact-modern-visit" id="visit-us"><div class="contact-modern-shell"><div class="contact-modern-visit-heading"><div><p class="contact-modern-kicker">${escapeHtml(page.visit.kicker)}</p><h2>${escapeHtml(page.visit.title)}</h2></div><p>${lines(page.visit.address)}</p></div><div class="contact-modern-map"><iframe src="${escapeHtml(page.visit.mapUrl)}" title="${escapeHtml(page.visit.mapTitle)}" loading="lazy" allowfullscreen></iframe></div></div></section>
  </main>`
  });
}

export function renderThankYouPage(page) {
  const buttons = page.confirmation.buttons.map((button) => `<a class="${button.primary ? "contact-modern-submit" : "contact-thank-you-secondary"}" href="${escapeHtml(button.href)}">${escapeHtml(button.label)}</a>`).join("");
  return renderSitePage({
    title: page.meta.pageTitle,
    description: page.meta.description,
    additionalHead: '<meta name="robots" content="noindex,follow">',
    revampVersion: "20260908-contact-content",
    body: `  <main class="contact-modern contact-thank-you"><section class="contact-modern-hero"><div class="contact-modern-shell"><p class="contact-modern-kicker">${escapeHtml(page.hero.kicker)}</p><h1>${escapeHtml(page.hero.title)}</h1><p>${escapeHtml(page.hero.description)}</p></div></section><section class="contact-thank-you-main"><div class="contact-modern-shell"><div class="contact-thank-you-card"><span class="contact-thank-you-icon" aria-hidden="true"><i class="fa fa-check"></i></span><h2>${escapeHtml(page.confirmation.title)}</h2><p>${escapeHtml(page.confirmation.description)}</p><div class="contact-thank-you-actions">${buttons}</div></div></div></section></main>`
  });
}
