/**
 * Service Worker for SEO4musicians PWA
 * (https://mh1.eu/tools/SEO4musicians)
 * Provides offline caching, asset versioning, and offline availability
 */

const CACHE_NAME = 'seo4musicians-v1.3.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png'
];

// External CDN resources to attempt caching on install or runtime
const EXTERNAL_CDNS = [
  'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(PRECACHE_ASSETS);
      try {
        await Promise.allSettled(
          EXTERNAL_CDNS.map((url) =>
            fetch(url, { mode: 'cors' }).then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => null)
          )
        );
      } catch (err) {
        console.warn('[SW] Some CDN assets could not be precached:', err);
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate for app assets, Network-First with Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  // Pass through video files (.mp4), range requests, and external APIs directly
  if (url.pathname.endsWith('.mp4') || 
      event.request.headers.get('range') || 
      url.hostname.includes('musicbrainz.org') || 
      url.hostname.includes('allorigins') || 
      url.hostname.includes('corsproxy')) {
    return; // Pass through to network directly
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          throw err;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
