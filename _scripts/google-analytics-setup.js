---
permalink: /assets/js/google-analytics-setup.js
---
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

// Deny all storage by default to prevent cookies
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
gtag("set", "ads_data_redaction", true);

gtag("js", new Date());
gtag("config", "{{ site.google_analytics }}", {
    'anonymize_ip': true,
    'send_page_view': true
});
