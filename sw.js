/* ============================================
   CohusDex — Service Worker
   Cache-first for static assets. Offline-ready.
   ============================================ */

const CACHE_NAME = 'cohusdex-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/faidaza.html',
  '/products.html',
  '/about.html',
  '/contact.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json'
];

// Install: cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).catch(function() {
      // Non-critical: proceed even if some assets fail to cache
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external URLs and browser extensions
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first strategy for navigation and static assets
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        // Return cached version immediately, update cache in background
        fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
        }).catch(function() {});
        return cached;
      }
      // Not in cache — fetch from network
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // For other failures, just fail
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
