// public/service-worker.js
const CACHE_NAME = 'babybliss-demo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/styles.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install -> cache core assets
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

// Fetch -> cache-first fallback
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then((cached) => cached || fetch(evt.request))
  );
});

// Listen for messages (optional)
self.addEventListener('message', (event) => {
  // console.log('SW message', event.data);
});

// Make service worker able to show notifications from site
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      if (clientsArr.length > 0) return clientsArr[0].focus();
      return clients.openWindow('/');
    })
  );
});