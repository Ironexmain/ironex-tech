(function () {
  'use strict';

  var COUNTER_ID = 105009501;
  var CONTACT_GOALS = {
    phone: 'contact_phone',
    email: 'contact_email',
    whatsapp: 'contact_whatsapp',
    telegram: 'contact_telegram'
  };

  function pageType(pathname) {
    if (pathname.indexOf('/blog/') === 0) return 'article';
    if (pathname === '/blog.html') return 'blog_index';
    if (pathname === '/kontakty.html') return 'contact';
    if (pathname === '/' || pathname === '/index.html') return 'home';
    return 'service';
  }

  function placement(element) {
    if (element.closest('nav, .nav, .nav-actions, .mob-menu')) return 'navigation';
    if (element.closest('footer')) return 'footer';
    if (element.closest('.cta, [id="cta"], .channel-card, .cta-ch, .cta-channel')) return 'cta';
    return 'content';
  }

  function contactChannel(element) {
    var href = (element.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return 'phone';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.indexOf('wa.me/') !== -1 || href.indexOf('whatsapp.com/') !== -1) return 'whatsapp';
    if (href.indexOf('t.me/') !== -1 || href.indexOf('telegram.me/') !== -1) return 'telegram';
    return null;
  }

  function sendGoal(goal, params) {
    if (typeof window.ym !== 'function') return;
    window.ym(COUNTER_ID, 'reachGoal', goal, params);
  }

  function trackContact(channel, method, element) {
    var pathname = window.location.pathname || '/';
    var params = {
      contact: {
        channel: channel,
        method: method,
        placement: placement(element)
      },
      page: {
        path: pathname,
        type: pageType(pathname)
      }
    };

    sendGoal(CONTACT_GOALS[channel], params);
    sendGoal('contact_any', params);
  }

  document.addEventListener('click', function (event) {
    var emailCopy = event.target.closest('[data-copy-email]');
    if (emailCopy) {
      trackContact('email', 'copy', emailCopy);
      return;
    }

    var link = event.target.closest('a[href]');
    if (!link) return;

    var channel = contactChannel(link);
    if (channel) trackContact(channel, 'click', link);
  });
})();
