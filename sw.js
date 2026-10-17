const CACHE_PREFIX = "alvo4sat-standard-";
const CACHE_NAME = CACHE_PREFIX + 'student-number-notice-1';
const ASSETS = ["./icon-192.png?v=4","./icon-512.png?v=4","./icon-maskable-192.png?v=4","./icon-maskable-512.png?v=4","./icon.svg?v=4","./favicon.ico?v=4","./favicon-16.png?v=4","./favicon-32.png?v=4","./apple-touch-icon.png?v=4","./manifest.webmanifest?v=4",
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./favicon-16.png",
  "./favicon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
