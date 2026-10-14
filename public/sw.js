/* dOS Enterprise Workspace — Service Worker v2
   Strategy:
     - Static assets (JS, CSS, fonts) → Cache-first
     - HTML / navigation               → Network-first with cache fallback
     - API / blockchain calls          → Network-only (bypass cache)
*/

const CACHE_NAME    = 'dos-v2';
const STATIC_CACHE  = 'dos-static-v2';
const DYNAMIC_CACHE = 'dos-dynamic-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
];

/* ── Install: precache shell assets ──────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clean old caches ──────────────────────────── */
self.addEventListener('activate', (event) => {
  const VALID = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !VALID.includes(k))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: routing strategies ───────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin (e.g. Google Fonts loaded at runtime) */
  if (request.method !== 'GET') return;

  /* Blockchain / API calls — always network only */
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/rpc/') ||
    url.hostname.includes('infura.io') ||
    url.hostname.includes('alchemy.com')
  ) {
    return; /* let browser handle it */
  }

  /* Google Fonts — cache-first (long-lived) */
  if (url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.status === 200) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  /* Static assets (JS, CSS, images, wasm) — cache-first */
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|webp|ico|wasm)$/)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) {
            /* Revalidate in background (stale-while-revalidate) */
            fetch(request).then((fresh) => {
              if (fresh.status === 200) cache.put(request, fresh);
            }).catch(() => {});
            return cached;
          }
          return fetch(request).then((response) => {
            if (response.status === 200) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  /* HTML / navigation — network-first, fallback to cache */
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request)
          .then((cached) => cached || caches.match('/'))
      )
  );
});
