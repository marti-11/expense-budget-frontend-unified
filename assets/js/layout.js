
(function () {
  const pages = [
    { file: 'home-base.html', label: 'Home Base', shortLabel: 'Home', icon: 'home' },
    { file: 'spending-spree.html', label: 'Spending Spree', shortLabel: 'Spending', icon: 'receipt_long' },
    { file: 'money-jails.html', label: 'Money Jails', shortLabel: 'Budgets', icon: 'lock' },
    { file: 'my-face.html', label: 'My Face', shortLabel: 'My Face', icon: 'face' }
  ];

  function currentFile() {
    const file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  }

  function isActive(file) {
    return currentFile() === file;
  }

  function navLinks(mobile) {
    return pages.map(function (page) {
      const active = isActive(page.file) ? ' is-active' : '';
      if (mobile) {
        return '<a class="ff-mobile-link' + active + '" href="' + page.file + '">' +
          '<span class="material-symbols-outlined">' + page.icon + '</span>' +
          '<span>' + page.shortLabel + '</span>' +
        '</a>';
      }
      return '<a class="ff-nav-link' + active + '" href="' + page.file + '">' + page.label + '</a>';
    }).join('');
  }

  function renderLayout() {
    const headerTarget = document.getElementById('app-header');
    const navbarTarget = document.getElementById('app-navbar');
    if (headerTarget) {
      headerTarget.innerHTML =
        '<header class="ff-app-header">' +
          '<div class="ff-header-inner">' +
            '<a class="ff-brand" href="home-base.html" aria-label="Fizcal Funhouse home">' +
              '<span class="material-symbols-outlined">account_balance</span>' +
              '<span>Fizcal Funhouse</span>' +
            '</a>' +
            '<nav class="ff-desktop-nav" aria-label="Main navigation">' + navLinks(false) + '</nav>' +
            '<div class="ff-header-actions">' +
              '<a class="ff-icon-link notifications-link" href="#" aria-label="Notifications">' +
                '<span class="material-symbols-outlined">notifications</span>' +
              '</a>' +
              '<a class="ff-icon-link profile-link' + (isActive('my-face.html') ? ' is-active' : '') + '" href="my-face.html" aria-label="Open My Face profile">' +
                '<span class="material-symbols-outlined">face</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</header>';
    }
    if (navbarTarget) {
      navbarTarget.innerHTML = '<nav class="ff-mobile-nav" aria-label="Mobile navigation">' + navLinks(true) + '</nav>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }
})();
