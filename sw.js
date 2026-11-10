/* NPRO PARTNER + PARTNER MASTER offline worker.
   Online: always loads the newest app and prices (network first).
   Offline or very slow network: opens the saved copy at once. */
var CACHE = "npro-partner-v4";
var CORE = [
  "./", "./index.html", "./master.html",
  "./manifest.json", "./manifest-master.json",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png",
  "./icon-master-192.png", "./icon-master-512.png", "./apple-touch-icon-master.png"
];
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: "reload" })).catch(function () {}); }));
  }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k.indexOf("npro-partner") === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function pageFallback(req) {
  var p = new URL(req.url).pathname;
  return caches.match(/master\.html$/.test(p) ? "./master.html" : "./index.html");
}
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  /* the Quotation app (quotation/ folder) has its own worker; never answer for it */
  if (new URL(req.url).pathname.indexOf("/quotation/") >= 0) return;
  var nav = req.mode === "navigate";
  /* always ask GitHub for the newest page / price file (no 10-minute browser cache), build 75 */
  var fresh = nav || /\.(html|json)$/.test(new URL(req.url).pathname);
  var net = fetch(fresh ? new Request(req.url, { cache: "no-cache", credentials: "same-origin" }) : req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  });
  var saved = function () {
    return caches.match(req, { ignoreSearch: true }).then(function (m) { return m || (nav ? pageFallback(req) : undefined); });
  };
  if (!nav) { e.respondWith(net.catch(saved)); return; }
  /* pages: wait at most 4 seconds for the network, then open the saved copy */
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () { saved().then(function (m) { if (!done && m) { done = true; resolve(m); } }); }, 4000);
    net.then(function (r) { if (!done) { done = true; clearTimeout(t); resolve(r); } })
       .catch(function () { saved().then(function (m) { if (!done) { done = true; clearTimeout(t); resolve(m || Response.error()); } }); });
  }));
});
