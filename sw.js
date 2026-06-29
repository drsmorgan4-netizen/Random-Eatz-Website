const CACHE = 'random-eatz-v1';
const ASSETS = ['/app.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls and Google Sheets, cache fallback for app shell
  if (e.request.url.includes('api.anthropic') || e.request.url.includes('google') || e.request.url.includes('zapier') || e.request.url.includes('intuit')) {
    return; // Let these go to network
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
