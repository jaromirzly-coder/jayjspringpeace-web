/* Cookie consent (Google Consent Mode v2) + GA4 events + mobile menu. GA loads only after "Accept". */
(function () {
  var html = document.documentElement;
  var GA_ID = html.getAttribute("data-ga");
  var SITE = html.getAttribute("data-site");
  var KEY = html.getAttribute("data-consent-key");
  var AIBLAB_SITES = ["aibeva.com", "aiblab.info", "aibsn.org", "aibguardian.info", "aibgin.info",
    "aibfamily.cloud", "iamyouraib.online", "jayjspringpeace.online"];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  var loaded = false;
  function loadGA() {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (loaded) return;
    loaded = true;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }
  function revokeGA() {
    gtag("consent", "update", { analytics_storage: "denied" });
    // Remove any GA cookies set under an earlier "Accept".
    var host = location.hostname;
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n !== "_ga" && n.indexOf("_ga_") !== 0) return;
      ["", "; domain=" + host, "; domain=." + host.replace(/^www\./, "")].forEach(function (d) {
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
      });
    });
  }

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: choice holds for this page view */ }
  }

  function banner() {
    var b = document.getElementById("cookie");
    if (b) return b;
    b = document.createElement("div");
    b.id = "cookie";
    b.className = "cookie";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-live", "polite");
    b.setAttribute("aria-label", "Cookie consent");
    b.innerHTML =
      '<div class="cookie-box"><p>We use Google Analytics cookies to understand how this site is used &mdash; only if you agree. No ads, no tracking pixels.</p>' +
      '<div class="cookie-row"><div class="cookie-btns"><button type="button" class="acc">Accept</button><button type="button" class="rej">Reject</button></div>' +
      '<a href="/privacy-policy">Privacy Policy</a></div></div>';
    document.body.appendChild(b);
    b.querySelector(".acc").addEventListener("click", function () { setChoice("granted"); b.hidden = true; loadGA(); });
    b.querySelector(".rej").addEventListener("click", function () { setChoice("denied"); b.hidden = true; revokeGA(); });
    return b;
  }

  function track(name, params) {
    if (loaded && getChoice() === "granted") gtag("event", name, params);
  }

  function onClick(ev) {
    var a = ev.target.closest ? ev.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("mailto:") === 0) {
      track("email_click", { address: href.slice(7).split("?")[0] });
      return;
    }
    var url;
    try { url = new URL(href, location.href); } catch (e) { return; }
    var host = url.hostname.replace(/^www\./, "");
    if (host === "dl.aibeva.com" || (host === "aibeva.com" && url.pathname.replace(/\/$/, "") === "/download")) {
      track("download_click", { link_url: url.href });
    } else if (AIBLAB_SITES.indexOf(host) !== -1 && host !== SITE) {
      track("outbound_click", { url: url.href });
    }
  }

  function init() {
    var c = getChoice();
    if (c === "granted") loadGA();
    else if (c !== "denied") banner().hidden = false;

    var settings = document.querySelectorAll("[data-cookie-settings]");
    for (var i = 0; i < settings.length; i++) {
      settings[i].addEventListener("click", function () { banner().hidden = false; });
    }
    document.addEventListener("click", onClick, true);

    var btn = document.querySelector(".menu-btn");
    var nav = document.getElementById("mobile-nav");
    if (btn && nav) {
      btn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
