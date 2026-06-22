/* ============================================
   COHUSDEX — Service Worker
   Cache-first strategy for static assets
   ============================================ */

var CACHE_NAME = 'cohusdex-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json'
];

// Install: cache static assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first, network fallback
self.addEventListener('fetch', function (event) {
  // Skip non-GET and external requests
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // Skip Google Fonts, APIs, and external resources
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('api.cohusdex.com') ||
      url.hostname.includes('formspree.io') ||
      url.hostname.includes('github.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetched = fetch(event.request).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        return cached || new Response('Offline', { status: 503 });
      });

      return cached || fetched;
    })
  );
});
