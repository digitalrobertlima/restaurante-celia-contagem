/* Service Worker avançado para atualização agressiva e fallback emergencial */
const APP_VERSION = 'v0.0.0-betatest';
const CACHE_PREFIX = 'celia';
const CORE_CACHE = `${CACHE_PREFIX}-core-${APP_VERSION}`;
const PAGES_CACHE = `${CACHE_PREFIX}-pages-${APP_VERSION}`;
const ASSETS_CACHE = `${CACHE_PREFIX}-assets-${APP_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${APP_VERSION}`;

// Core: arquivos indispensáveis para inicializar
const CORE_ASSETS = [
  './',          // index.html (GitHub Pages root relative)
  'index.html',
  'offline.html',
  'manifest.webmanifest',
  'version.json'
];

// Timeout de rede para navegação (ms)
const NAV_TIMEOUT = 5000;

// Instala SW: pré-cache mínimo e ativa imediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Limpa caches antigos e notifica clientes de nova versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k.startsWith(CACHE_PREFIX) && !k.includes(APP_VERSION))
            .map(k => caches.delete(k))
      );
      await self.clients.claim();
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: 'NEW_VERSION', version: APP_VERSION });
      }
    })()
  );
});

// Helper: tentativa de rede com timeout
async function networkWithTimeout(request, timeoutMs) {
  return await Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
  ]);
}

// Estratégia para navegação: network-first com timeout, fallback cache -> offline.html
async function handleNavigation(request) {
  try {
    const response = await networkWithTimeout(request, NAV_TIMEOUT);
    const copy = response.clone();
    caches.open(PAGES_CACHE).then(c => c.put(request, copy));
    return response;
  } catch (err) {
    // Rede falhou ou timeout: tenta cache
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('offline.html');
  }
}

// Estratégia para assets estáticos (CSS, JS, imagens, manifest): stale-while-revalidate
async function handleStaticAsset(request) {
  const cache = await caches.open(ASSETS_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(resp => {
    if (resp && resp.status === 200) {
      cache.put(request, resp.clone());
    }
    return resp;
  }).catch(() => cached);
  return cached || fetchPromise;
}

// Estratégia para outros GET: network-first fallback cache
async function handleRuntime(request) {
  try {
    const resp = await fetch(request);
    const copy = resp.clone();
    caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
    return resp;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw e;
  }
}

function isNavigation(request) {
  return request.mode === 'navigate' || (request.destination === '' && request.headers.get('accept')?.includes('text/html'));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isNavigation(request)) {
    event.respondWith(handleNavigation(request));
    return;
  }

  const dest = request.destination;
  if (['style','script','image','font','manifest'].includes(dest)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // version.json deve sempre vir da rede (detectar build novo), fallback cache se offline
  if (request.url.endsWith('version.json')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        const copy = fresh.clone();
        caches.open(CORE_CACHE).then(c => c.put(request, copy));
        return fresh;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error('Sem version.json');
      }
    })());
    return;
  }

  event.respondWith(handleRuntime(request));
});

// Recebe comando de skipWaiting manual (para futura UI de atualização)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
