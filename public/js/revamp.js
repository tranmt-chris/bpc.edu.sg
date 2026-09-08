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
