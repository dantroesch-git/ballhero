/* BallHero Kids — offline cache
   Strategy: network-first for our own app shell (so updates always land),
   falling back to cache when offline. */
const CACHE = 'ballhero-v27';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './demos.js', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle same-origin GET; let the CDN (MediaPipe) go straight to network
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Refresh the cache with the newest version
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
  );
});
