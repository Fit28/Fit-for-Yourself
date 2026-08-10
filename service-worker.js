const CACHE="ffy-github-v131-2";
const CORE=[
  "/Fit-for-Yourself/",
  "/Fit-for-Yourself/index.html",
  "/Fit-for-Yourself/manifest.json",
  "/Fit-for-Yourself/icon-192.png",
  "/Fit-for-Yourself/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(hit => hit || caches.match("/Fit-for-Yourself/index.html")))
  );
});

