// Consent-gated analytics loader (GA4 + Microsoft Clarity).
// Nothing loads until the visitor accepts cookies (abm_cookie_consent === 'true').
(function () {
  var CONSENT_KEY = 'abm_cookie_consent';
  var loaded = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    // Google Analytics 4
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-D8GQDGVR08';
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-D8GQDGVR08', { anonymize_ip: true });

    // Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', 'sxaf839npz');
  }

  // Exposed so the cookie banner can trigger loading on Accept.
  window.abmLoadAnalytics = loadAnalytics;

  try {
    if (localStorage.getItem(CONSENT_KEY) === 'true') loadAnalytics();
  } catch (e) { /* localStorage unavailable — stay unloaded */ }
})();
