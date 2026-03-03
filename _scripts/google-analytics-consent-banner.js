---
permalink: /assets/js/google-analytics-consent-banner.js
---
(function () {
  var STORAGE_KEY = "ga-consent-choice";
  var banner = document.getElementById("ga-consent-banner");

  if (!banner || typeof gtag !== "function") {
    return;
  }

  function updateConsent(isGranted) {
    var state = isGranted ? "granted" : "denied";

    gtag("consent", "update", {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
    gtag("set", "ads_data_redaction", !isGranted);
  }

  function storeChoice(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (error) {
      // Ignore storage errors (private mode or disabled storage).
    }
  }

  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function applyChoice(choice) {
    var isGranted = choice === "granted";
    updateConsent(isGranted);
    hideBanner();
  }

  var savedChoice = readChoice();
  if (savedChoice === "granted" || savedChoice === "denied") {
    applyChoice(savedChoice);
    return;
  }

  banner.hidden = false;

  banner.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    var action = target.getAttribute("data-ga-consent-action");
    if (action === "accept") {
      storeChoice("granted");
      applyChoice("granted");
    } else if (action === "deny") {
      storeChoice("denied");
      applyChoice("denied");
    }
  });
})();
