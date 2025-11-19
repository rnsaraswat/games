const CACHE_NAME = 'rg-shell-v1';
const PRECACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/manifest.json',
    '/assets/icons/rgh-192x192.png',
    '/assets/icons/rgh-512x512.png'
];
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      )
    );
  });

// self.addEventListener('activate', 
// e => e.waitUntil(caches.keys().then(keys => 
//     Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => 
//         caches.delete(k)))).then(() => self.clients.claim())));

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//       caches.match(event.request).then((cached) => {
//         return cached || fetch(event.request);
//       })
//     );
//   });


self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.origin !== location.origin) {
        // network-first for external
        e.respondWith(fetch(e.request).then(resp => {
            caches.open(CACHE_NAME).then(c => c.put(e.request, resp.clone())); return resp;
        }).catch(() => caches.match(e.request)));
        return;
    }
    // cache-first for app shell
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => { caches.open(CACHE_NAME).then(c => c.put(e.request, resp.clone())); return resp; })).catch(() => caches.match('/index.html')));
});