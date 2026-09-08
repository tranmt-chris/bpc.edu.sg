(function () {
  var header = document.querySelector('header');
  if (!header) return;

  var menu = header.querySelector('#menu');
  var toggle = header.querySelector('.revamp-menu-toggle');
  if (!menu || !toggle) return;
  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  menu.querySelectorAll('a[href]').forEach(function (link) {
    var hrefPage = link.getAttribute('href').split('#')[0].toLowerCase();
    var active = currentPage === hrefPage;
    link.classList.toggle('active', active);
    if (active) {
      var group = link.closest('.revamp-nav-group');
      if (group) group.classList.add('current');
    }
  });

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

})();
