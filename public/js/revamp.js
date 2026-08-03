(function () {
  var header = document.querySelector('header');
  var menu = document.getElementById('menu');
  if (!header || !menu) return;

  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var navigation = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', items: [
      ['About the College', 'about.html'],
      ['Our Staff', 'team.html'],
      ['Academic Staff', 'teamac.html'],
      ['Administrative Staff', 'teamnac.html'],
      ['Visiting Lecturers', 'teamvisit.html']
    ]},
    { label: 'Programmes', items: [
      ['Programme Overview', 'courses.html'],
      ['Introduction to Buddhism', 'intro.html'],
      ['Introduction to Buddhism — Chinese', 'introc.html'],
      ['Diploma in Buddhism', 'dip.html'],
      ['Diploma in Buddhism — Chinese', 'dipc.html'],
      ['BA in Buddhist Studies', 'ba.html'],
      ['MA in Buddhist Studies', 'ma.html'],
      ['Buddhist Counselling', 'bc.html']
    ]},
    { label: 'Resources', items: [
      ['Key Dates', 'key.html'],
      ['Recommended Texts', 'books.html'],
      ['eLibrary', 'elibrary.html']
    ]},
    { label: 'Community', items: [
      ['Alumni', 'alumni.html'],
      ['Gallery', 'gallery.html']
    ]},
    { label: 'Contact', items: [
      ['Contact Us', 'contact.html'],
      ['Visit Us', 'visit.html']
    ]}
  ];

  function navItem(group) {
    if (group.href) {
      var active = currentPage === group.href.toLowerCase() ? ' active' : '';
      return '<li class="revamp-nav-item"><a class="revamp-nav-link' + active + '" href="' + group.href + '">' + group.label + '</a></li>';
    }
    var groupActive = group.items.some(function (item) { return currentPage === item[1].toLowerCase(); });
    var children = group.items.map(function (item) {
      var active = currentPage === item[1].toLowerCase() ? ' class="active"' : '';
      return '<li><a' + active + ' href="' + item[1] + '">' + item[0] + '</a></li>';
    }).join('');
    return '<li class="revamp-nav-group' + (groupActive ? ' current' : '') + '">' +
      '<button class="revamp-nav-trigger" type="button" aria-expanded="false">' + group.label + '<span aria-hidden="true">⌄</span></button>' +
      '<ul class="revamp-nav-dropdown">' + children + '</ul></li>';
  }

  menu.innerHTML = '<li><ul class="submenu revamp-primary-nav">' + navigation.map(navItem).join('') + '</ul></li>';

  if (!header.querySelector('.logo')) {
    var logo = document.createElement('a');
    logo.className = 'revamp-logo';
    logo.href = 'index.html';
    logo.setAttribute('aria-label', 'Buddhist and Pali College of Singapore home');
    logo.innerHTML = '<img src="images/bpclogo3x3b.png" alt="Buddhist and Pali College of Singapore Logo">';
    header.insertBefore(logo, menu);
  }

  var toggle = document.createElement('button');
  toggle.className = 'revamp-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '&#9776;';
  header.insertBefore(toggle, menu);

  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.innerHTML = open ? '&times;' : '&#9776;';
  });

  menu.querySelectorAll('.revamp-nav-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var group = trigger.closest('.revamp-nav-group');
      var open = !group.classList.contains('is-open');
      menu.querySelectorAll('.revamp-nav-group.is-open').forEach(function (item) {
        item.classList.remove('is-open');
        item.querySelector('.revamp-nav-trigger').setAttribute('aria-expanded', 'false');
      });
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '&#9776;';
    }
  });

  var contactForm = document.querySelector('form[action="html_form_send.php"]');
  if (contactForm) contactForm.action = 'https://www.bpc.edu.sg/html_form_send.php';
})();
