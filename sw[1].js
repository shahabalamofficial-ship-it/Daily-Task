// Service Worker — makes the app open even with no internet connection.
const CACHE_NAME = 'daily-tasks-v1';
const FILES_TO_CACHE = [
  './',
  './index.html'
];

// Save the app files the first time it's visited (needs internet once).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Remove old cached versions when a new one is installed.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// When offline, serve the saved (cached) version instead of failing.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
