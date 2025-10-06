window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

// Deny all storage by default to prevent cookies
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied'
});

gtag("js", new Date());
gtag("config", "G-01T0SBSGBC", {
    'client_storage': 'none',
    'anonymize_ip': true,
    'send_page_view': true
});
