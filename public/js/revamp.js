(function () {
  var content = window.BPC_CONTENT || {};
  var header = document.querySelector('header');
  if (!header) return;

  var menu = document.createElement('ul');
  menu.id = 'menu';
  header.replaceChildren(menu);

  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var navigation = content.navigation || [];

  function navItem(group, index) {
    if (group.href) {
      var active = currentPage === group.href.toLowerCase() ? ' active' : '';
      return '<li class="revamp-nav-item"><a class="revamp-nav-link' + active + '" href="' + group.href + '">' + group.label + '</a></li>';
    }
    var itemLabel = function (item) { return Array.isArray(item) ? item[0] : item.label; };
    var itemHref = function (item) { return Array.isArray(item) ? item[1] : item.href; };
    var groupActive = group.items.some(function (item) { return currentPage === itemHref(item).split('#')[0].toLowerCase(); });
    var children = group.items.map(function (item) {
      var href = itemHref(item);
      var active = currentPage === href.split('#')[0].toLowerCase() ? ' class="active"' : '';
      return '<li><a' + active + ' href="' + href + '">' + itemLabel(item) + '</a></li>';
    }).join('');
    var dropdownId = 'revamp-nav-dropdown-' + index;
    return '<li class="revamp-nav-group' + (groupActive ? ' current' : '') + '">' +
      '<button class="revamp-nav-trigger" type="button" aria-expanded="false" aria-controls="' + dropdownId + '">' + group.label + '<span aria-hidden="true">⌄</span></button>' +
      '<ul class="revamp-nav-dropdown" id="' + dropdownId + '">' + children + '</ul></li>';
  }

  menu.innerHTML = '<li><ul class="submenu revamp-primary-nav">' + navigation.map(navItem).join('') + '</ul></li>';

  var brandLink;
  var legacyLogo = header.querySelector('.logo');

  if (!legacyLogo) {
    var logo = document.createElement('a');
    logo.className = 'revamp-logo';
    logo.href = 'index.html';
    logo.setAttribute('aria-label', 'Buddhist and Pali College of Singapore home');
    logo.innerHTML = '<img src="images/bpclogo3x3b.png" alt="Buddhist and Pali College of Singapore Logo">';
    header.insertBefore(logo, menu);
    brandLink = logo;
  } else {
    brandLink = legacyLogo.querySelector('a');
  }

  if (brandLink) {
    brandLink.classList.add('revamp-brand-link');
    brandLink.setAttribute('aria-label', 'Buddhist and Pali College of Singapore home');
    if (!brandLink.querySelector('.revamp-brand-name')) {
      var brandName = document.createElement('span');
      brandName.className = 'revamp-brand-name';
      brandName.innerHTML = '<span>Buddhist and Pali</span><span>College of Singapore</span>';
      brandLink.appendChild(brandName);
    }
  }

  var toggle = document.createElement('button');
  toggle.className = 'revamp-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '&#9776;';
  header.insertBefore(toggle, menu);

  function closeNavigation() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.innerHTML = '&#9776;';
    menu.querySelectorAll('.revamp-nav-group.is-open').forEach(function (group) {
      group.classList.remove('is-open');
      group.querySelector('.revamp-nav-trigger').setAttribute('aria-expanded', 'false');
    });
  }

  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.innerHTML = open ? '&times;' : '&#9776;';
  });

  menu.addEventListener('click', function (event) {
    var trigger = event.target.closest('.revamp-nav-trigger');
    if (trigger) {
      var group = trigger.closest('.revamp-nav-group');
      var open = !group.classList.contains('is-open');
      menu.querySelectorAll('.revamp-nav-group.is-open').forEach(function (item) {
        item.classList.remove('is-open');
        item.querySelector('.revamp-nav-trigger').setAttribute('aria-expanded', 'false');
      });
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      return;
    }
    if (event.target.closest('a')) {
      closeNavigation();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeNavigation();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1100 && document.body.classList.contains('nav-open')) closeNavigation();
  });

  var programme = content.programmes && content.programmes[currentPage];
  var programmeHero = document.querySelector('.programme-modern-hero');
  if (programme && programmeHero) {
    document.documentElement.lang = programme.language || 'en';
    var kicker = programmeHero.querySelector('.programme-modern-kicker');
    var title = programmeHero.querySelector('h1');
    var lead = programmeHero.querySelector('.programme-modern-lead');
    var primary = programmeHero.querySelector('.programme-modern-primary');
    var secondary = programmeHero.querySelector('.programme-modern-secondary');
    if (kicker) kicker.textContent = programme.kicker;
    if (title) title.textContent = programme.title;
    if (lead) lead.textContent = programme.lead;
    if (primary && programme.primary) {
      primary.textContent = programme.primary.label;
      primary.href = programme.primary.href;
    }
    if (secondary && programme.secondary) {
      secondary.textContent = programme.secondary.label;
      secondary.href = programme.secondary.href;
    }
  }

  var escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  var safeHref = function (value) {
    var href = String(value == null ? '' : value).trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^(https?|mailto|tel):/i.test(href)) return '#';
    return escapeHtml(href || '#');
  };
  var lines = function (values) {
    return (values || []).map(escapeHtml).join('<br>');
  };
  var renderProgrammeHeroNote = function (selector, note) {
    var panel = document.querySelector(selector);
    if (panel && note) panel.innerHTML = '<span>' + escapeHtml(note.label) + '</span><strong>' + escapeHtml(note.value) + '</strong><p>' + lines(note.description) + '</p>';
  };
  var renderProgrammeFacts = function (selector, facts) {
    var grid = document.querySelector(selector);
    if (grid) grid.innerHTML = (facts || []).map(function (fact) { return '<div><span>' + escapeHtml(fact.label) + '</span><strong>' + escapeHtml(fact.value) + '</strong></div>'; }).join('');
  };
  var renderProgrammeAdmissions = function (selector, admissions) {
    var panel = document.querySelector(selector);
    if (!panel || !admissions) return;
    var poster = admissions.poster || {};
    var posterHtml = poster.image ? '<a class="programme-modern-poster" href="' + safeHref(poster.href || poster.image) + '" target="_blank"><img src="' + safeHref(poster.image) + '" alt="' + escapeHtml(poster.alt) + '" loading="lazy" decoding="async"></a>' : '';
    var buttonHref = admissions.button && admissions.button.href;
    var buttonTarget = /^https?:\/\//i.test(buttonHref || '') ? ' rel="noreferrer" target="_blank"' : '';
    panel.innerHTML = '<p class="programme-modern-kicker">' + escapeHtml(admissions.kicker) + '</p><h2>' + escapeHtml(admissions.title) + '</h2>' + posterHtml +
      '<a class="programme-modern-primary" href="' + safeHref(buttonHref) + '"' + buttonTarget + '>' + escapeHtml(admissions.button && admissions.button.label) + '</a>' +
      '<div class="programme-modern-enquiry"><span>' + escapeHtml(admissions.contactLabel) + '</span>' + (admissions.contacts || []).map(function (contact) { return '<a href="' + safeHref(contact.href) + '">' + escapeHtml(contact.label) + '</a>'; }).join('') + '</div>' +
      '<p class="programme-modern-location">' + lines(admissions.location) + '</p><p class="programme-modern-teacher">' + escapeHtml(admissions.note) + '</p>';
  };

  var diploma = content.pages && content.pages['dip.html'];
  if (currentPage === 'dip.html' && diploma) {
    renderProgrammeHeroNote('[data-dip-hero-note]', diploma.heroNote);
    renderProgrammeFacts('[data-dip-facts] .programme-modern-fact-grid', diploma.facts);

    var diplomaContent = document.querySelector('[data-dip-content]');
    if (diplomaContent) {
      var overview = diploma.overview || {};
      var curriculum = diploma.curriculum || {};
      var venues = diploma.venues || {};
      var progression = diploma.progression || {};
      var venueCards = (venues.items || []).map(function (venue, index) {
        return '<article><span>' + escapeHtml(venue.label) + '</span>' +
          '<img class="programme-modern-venue-image' + (index === 1 ? ' programme-modern-venue-image-pohming' : '') + '" src="' + safeHref(venue.image) + '" alt="' + escapeHtml(venue.imageAlt || venue.name) + '" loading="lazy" decoding="async">' +
          '<h3>' + escapeHtml(venue.name) + '</h3><p>' + lines(venue.address) + '</p>' +
          '<ul>' + (venue.schedule || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>' +
          '<strong>' + escapeHtml(venue.commences) + '</strong></article>';
      }).join('');
      diplomaContent.innerHTML =
        '<p class="programme-modern-kicker">' + escapeHtml(overview.kicker) + '</p>' +
        '<h2>' + escapeHtml(overview.title) + '</h2><p>' + escapeHtml(overview.description) + '</p>' +
        '<div class="programme-modern-questions programme-modern-requirements">' +
          (overview.eligibility || []).map(function (item) { return '<p>' + escapeHtml(item) + '</p>'; }).join('') + '</div>' +
        '<p class="programme-modern-kicker">' + escapeHtml(curriculum.kicker) + '</p>' +
        '<h2>' + escapeHtml(curriculum.title) + '</h2>' +
        '<ol class="programme-modern-curriculum programme-modern-curriculum-five">' +
          (curriculum.items || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ol>' +
        '<p class="programme-modern-kicker">' + escapeHtml(venues.kicker) + '</p>' +
        '<h2>' + escapeHtml(venues.title) + '</h2><div class="programme-modern-venue-grid">' + venueCards + '</div>' +
        '<div class="programme-modern-next"><p class="programme-modern-kicker">' + escapeHtml(progression.kicker) + '</p>' +
        '<h2>' + escapeHtml(progression.title) + '</h2><p>' + escapeHtml(progression.prefix) + ' ' +
        '<a href="' + safeHref(progression.ba && progression.ba.href) + '">' + escapeHtml(progression.ba && progression.ba.label) + '</a>, ' +
        escapeHtml(progression.between) + ' <a href="' + safeHref(progression.ma && progression.ma.href) + '">' +
        escapeHtml(progression.ma && progression.ma.label) + '</a>.</p></div>';
    }

    var registration = diploma.registration || {};
    var registrationPanel = document.querySelector('[data-dip-registration]');
    if (registrationPanel) {
      var poster = registration.poster || {};
      var optionCards = (registration.options || []).map(function (option) {
        var dates = (option.dates || []).map(function (date) {
          return '<div class="programme-modern-preview-date"><span>' + escapeHtml(date.venue) + '</span>' +
            '<strong>' + escapeHtml(date.date) + '</strong><p>' + escapeHtml(date.time) + '</p></div>';
        }).join('');
        var button = option.button ? '<a class="programme-modern-primary" href="' + safeHref(option.button.href) + '" rel="noreferrer" target="_blank">' + escapeHtml(option.button.label) + '</a>' : '';
        var contact = option.contact && option.contact.label && option.contact.href ? '<a class="programme-modern-registration-contact" href="' + safeHref(option.contact.href) + '" rel="noreferrer" target="_blank">' + escapeHtml(option.contact.label) + '</a>' : '';
        return '<div class="programme-modern-registration-option"><span>' + escapeHtml(option.label) + '</span>' +
          '<h3>' + escapeHtml(option.title) + '</h3><p>' + escapeHtml(option.description) + '</p>' + dates + button + contact + '</div>';
      }).join('');
      var enquiry = registration.enquiry || {};
      registrationPanel.innerHTML =
        '<p class="programme-modern-kicker">' + escapeHtml(registration.kicker) + '</p><h2>' + escapeHtml(registration.title) + '</h2>' +
        '<a class="programme-modern-poster" href="' + safeHref(poster.href || poster.image) + '" target="_blank">' +
          '<img src="' + safeHref(poster.image) + '" alt="' + escapeHtml(poster.alt) + '" loading="lazy" decoding="async"></a>' +
        optionCards + '<div class="programme-modern-enquiry"><span>' + escapeHtml(enquiry.label) + '</span>' +
        '<a href="mailto:' + escapeHtml(enquiry.email) + '">' + escapeHtml(enquiry.email) + '</a>' +
        '<a href="tel:' + escapeHtml(enquiry.phone) + '">' + escapeHtml(enquiry.contactName) + ' · ' + escapeHtml(enquiry.phoneDisplay) + '</a></div>' +
        '<p class="programme-modern-teacher">' + escapeHtml(registration.note) + '</p>';
    }
  }

  var ba = content.pages && content.pages['ba.html'];
  if (currentPage === 'ba.html' && ba) {
    renderProgrammeHeroNote('[data-ba-hero-note]', ba.heroNote);
    renderProgrammeFacts('[data-ba-facts] .programme-modern-fact-grid', ba.facts);
    var baContent = document.querySelector('[data-ba-content]');
    if (baContent) {
      var eligibility = ba.eligibility || {};
      var structure = ba.structure || {};
      var progression = ba.progression || {};
      baContent.innerHTML = '<p class="programme-modern-kicker">' + escapeHtml(eligibility.kicker) + '</p><h2>' + escapeHtml(eligibility.title) + '</h2><p>' + escapeHtml(eligibility.prefix) + ' <a href="' + safeHref(eligibility.link && eligibility.link.href) + '">' + escapeHtml(eligibility.link && eligibility.link.label) + '</a> ' + escapeHtml(eligibility.suffix) + '</p>' +
        '<div class="programme-modern-questions programme-modern-requirements">' + (eligibility.requirements || []).map(function (item) { return '<p>' + escapeHtml(item) + '</p>'; }).join('') + '</div>' +
        '<p class="programme-modern-kicker">' + escapeHtml(structure.kicker) + '</p><h2>' + escapeHtml(structure.title) + '</h2><div class="programme-modern-year-grid">' +
        (structure.years || []).map(function (year) { return '<article><span>' + escapeHtml(year.label) + '</span><h3>' + escapeHtml(year.title) + '</h3><p>' + escapeHtml(year.description) + '</p></article>'; }).join('') + '</div>' +
        '<div class="programme-modern-next"><p class="programme-modern-kicker">' + escapeHtml(progression.kicker) + '</p><h2>' + escapeHtml(progression.title) + '</h2><p>' + escapeHtml(progression.prefix) + ' <a href="' + safeHref(progression.link && progression.link.href) + '">' + escapeHtml(progression.link && progression.link.label) + '</a>.</p></div>';
    }
    renderProgrammeAdmissions('[data-ba-admissions]', ba.admissions);
  }

  var ma = content.pages && content.pages['ma.html'];
  if (currentPage === 'ma.html' && ma) {
    renderProgrammeHeroNote('[data-ma-hero-note]', ma.heroNote);
    renderProgrammeFacts('[data-ma-facts] .programme-modern-fact-grid', ma.facts);
    var maContent = document.querySelector('[data-ma-content]');
    if (maContent) {
      var maEligibility = ma.eligibility || {};
      var maCurriculum = ma.curriculum || {};
      var assessment = ma.assessment || {};
      maContent.innerHTML = '<p class="programme-modern-kicker">' + escapeHtml(maEligibility.kicker) + '</p><h2>' + escapeHtml(maEligibility.title) + '</h2><p>' + escapeHtml(maEligibility.prefix) + ' <a href="' + safeHref(maEligibility.link && maEligibility.link.href) + '">' + escapeHtml(maEligibility.link && maEligibility.link.label) + '</a> ' + escapeHtml(maEligibility.suffix) + '</p>' +
        '<p class="programme-modern-kicker">' + escapeHtml(maCurriculum.kicker) + '</p><h2>' + escapeHtml(maCurriculum.title) + '</h2><ol class="programme-modern-curriculum">' + (maCurriculum.items || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ol>' +
        '<div class="programme-modern-next"><p class="programme-modern-kicker">' + escapeHtml(assessment.kicker) + '</p><h2>' + escapeHtml(assessment.title) + '</h2><p>' + escapeHtml(assessment.description) + '</p></div>';
    }
    renderProgrammeAdmissions('[data-ma-admissions]', ma.admissions);
  }

  var alumniGrid = document.querySelector('[data-alumni-grid]');
  var alumniFilters = document.querySelector('[data-alumni-filters]');
  if (alumniGrid) {
    var alumniCards = Array.from(alumniGrid.children);
    if (alumniFilters) {
      var recentYears = ['All'].concat(Array.from(new Set(alumniCards.map(function (item) { return item.dataset.year; }))).slice(0, 3));
      recentYears.push('Older');
      alumniFilters.innerHTML = recentYears.map(function (year, index) {
        return '<button type="button" class="' + (index === 0 ? 'active' : '') + '" data-alumni-year="' + year + '">' + year + '</button>';
      }).join('');
      alumniFilters.addEventListener('click', function (event) {
        var button = event.target.closest('[data-alumni-year]');
        if (!button) return;
        var selected = button.dataset.alumniYear;
        alumniFilters.querySelectorAll('button').forEach(function (item) { item.classList.toggle('active', item === button); });
        alumniCards.forEach(function (item) {
          var isOlder = !recentYears.slice(1, -1).includes(item.dataset.year);
          item.hidden = selected !== 'All' && (selected === 'Older' ? !isOlder : item.dataset.year !== selected);
        });
      });
    }
  }

  document.querySelectorAll('.texts-modern .cart-grid').forEach(function (card) {
    var image = card.querySelector('img');
    var info = card.querySelector('.info');
    if (!image || !info || card.querySelector('.texts-modern-book-title')) return;
    var title = document.createElement('h2');
    title.className = 'texts-modern-book-title';
    title.textContent = image.alt;
    card.insertBefore(title, info);
    var price = info.querySelector('li');
    if (price) price.textContent = price.textContent + ' donation';
  });

  var footer = document.querySelector('[data-site-footer]');
  if (!footer) {
    footer = document.createElement('footer');
    footer.setAttribute('data-site-footer', '');
    document.body.appendChild(footer);
  }
  footer.className = 'bpc-shared-footer';
  if (content.footer) {
    var social = (content.footer.social || []).map(function (item) {
      return '<a href="' + item.href + '" rel="noreferrer" target="_blank" aria-label="' + item.label + '">' +
        '<i class="fa fa-' + item.icon + '" aria-hidden="true"></i></a>';
    }).join('');
    footer.innerHTML = '<p>' + content.footer.copyright + '</p><div class="bpc-shared-social">' + social + '</div>';
  }
  if (footer.parentElement !== document.body || footer !== document.body.lastElementChild) {
    document.body.appendChild(footer);
  }

})();
