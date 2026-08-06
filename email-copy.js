(function () {
  'use strict';

  var DEFAULT_LABEL = 'Скопировать';
  var SUCCESS_LABEL = 'Скопировано ✓';
  var ERROR_LABEL = 'Не удалось';

  function emailFromScope(scope) {
    var source = scope.querySelector('[data-email-value]');
    var visibleEmail = source ? source.textContent.trim() : '';

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visibleEmail)) {
      return visibleEmail;
    }

    var emailLink = scope.querySelector('a[href^="mailto:"]');
    if (!emailLink) return '';

    return decodeURIComponent(emailLink.getAttribute('href'))
      .replace(/^mailto:/i, '')
      .split('?')[0]
      .trim();
  }

  function fallbackCopy(value) {
    var field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    field.style.pointerEvents = 'none';
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, field.value.length);

    var copied = document.execCommand('copy');
    document.body.removeChild(field);
    if (!copied) throw new Error('Copy command was rejected');
  }

  function copyEmail(value) {
    return new Promise(function (resolve, reject) {
      try {
        fallbackCopy(value);
        resolve();
        return;
      } catch (error) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(resolve, reject);
          return;
        }

        reject(error);
      }
    });
  }

  function showState(button, state, label) {
    window.clearTimeout(button.copyStateTimer);
    button.dataset.copyState = state;
    button.textContent = label;
    button.copyStateTimer = window.setTimeout(function () {
      delete button.dataset.copyState;
      button.textContent = DEFAULT_LABEL;
    }, 2200);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-copy-email]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    var scope = button.closest('[data-email-copy]');
    var email = scope ? emailFromScope(scope) : '';

    if (!email) {
      showState(button, 'error', ERROR_LABEL);
      return;
    }

    copyEmail(email).then(function () {
      showState(button, 'success', SUCCESS_LABEL);
    }).catch(function () {
      showState(button, 'error', ERROR_LABEL);
    });
  });
}());
