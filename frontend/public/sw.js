const CACHE_NAME = 'smartstudy-v2';
const OFFLINE_PAGE = '/offline';

async function matchCache(request) {
  try {
    return await caches.match(request);
  } catch {
    return undefined;
  }
}

function unavailableResponse(message = 'Offline') {
  return new Response(message, {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

const PRECACHE_RESOURCES = [
  '/',
  '/offline',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (HTML pages) -> Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await matchCache(request);
          if (cached) return cached;
          const offlinePage = await matchCache(OFFLINE_PAGE);
          return offlinePage || unavailableResponse();
        })
    );
    return;
  }

  // 2. Static assets (JS chunks, CSS, fonts, images) -> Cache-First
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff|woff2|ico|css|js)$/i);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clone))
              .catch(() => undefined);
          }
          return networkResponse;
        }).catch(async () => {
          return (await matchCache(request)) || unavailableResponse('This resource is unavailable offline.');
        });
      })
    );
    return;
  }

  // 3. API / Other GET requests -> Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .catch(() => undefined);
        }
        return networkResponse;
      })
      .catch(async () => {
        return (await matchCache(request)) || new Response(
          JSON.stringify({ error: 'Service unavailable offline.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        );
      })
  );
});
