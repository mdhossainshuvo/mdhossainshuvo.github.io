(function () {
  var link = document.getElementById('groupApplicationLink');
  var status = document.getElementById('groupApplicationStatus');
  if (!link) return;

  var url = window.GROUP_APPLICATION_FORM_URL || '';
  var isDeployedWebApp = /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(url);
  if (isDeployedWebApp) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (status) status.hidden = true;
    return;
  }

  link.removeAttribute('href');
  link.setAttribute('aria-disabled', 'true');
  link.setAttribute('tabindex', '-1');
  link.classList.add('is-unavailable');
  if (status) status.hidden = false;
}());
