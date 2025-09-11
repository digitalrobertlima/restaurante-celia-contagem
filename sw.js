/* Service Worker básico para pré-cache e offline fallback */
const APP_VERSION = 'v0.0.0-betatest';
const CORE_CACHE = `core-${APP_VERSION}`;
const RUNTIME_CACHE = `runtime-${APP_VERSION}`;
// Usar caminhos relativos para compatibilidade com GitHub Pages (evita buscar na raiz do domínio)
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => ![CORE_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Estratégia: Network first para HTML, Cache first para resto
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(resp => {
        const copy = resp.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
        return resp;
  }).catch(() => caches.match(request).then(cached => cached || caches.match('offline.html')))
    );
    return;
  }

  if (request.method !== 'GET') return; // só cache GET

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(resp => {
        const copy = resp.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
        return resp;
      }).catch(() => cached);
    })
  );
});
