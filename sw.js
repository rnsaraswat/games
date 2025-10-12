/* Simple service worker for caching basic shell and offline fallback */
// const CACHE_NAME = 'rg-shell-v1';
// const OFFLINE_URL = '/index.html';
// const ASSETS = [
//     '/', '/index.html', '/manifest.json'
// ];
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(self.skipWaiting())
//     );
// });
// self.addEventListener('activate', (event) => {
//     event.waitUntil(self.clients.claim());
// });
// self.addEventListener('fetch', (event) => {
//     if (event.request.method !== 'GET') return;
//     event.respondWith(
//         caches.match(event.request).then((r) => r || fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
//     );
// });



const CACHE_NAME = 'rg-shell-v1';
// const PRECACHE = [
// '/', '/index.html', '/style.css', '/app.js', '/manifest.json'
// ];
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles.css',
    '/leaderboard/',
    '/games/tictactoe/',
    '/games/mastermind/',
    '/leaderboard/submit-helper.js'
  ];

  self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
  });

// self.addEventListener('install', event => {
// event.waitUntil(
// caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(()=>self.skipWaiting())
// );
// });


// self.addEventListener('activate', event => {
// event.waitUntil(
// caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))).then(()=>self.clients.claim())
// );
// });

self.addEventListener('activate', e => {
    e.waitUntil(
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
    );
  });


// self.addEventListener('fetch', event => {
    // if(event.request.method !== 'GET') return;
    // const url = new URL(event.request.url);
    // Network-first for API/leaderboard calls
    // if(url.pathname.startsWith('/leaderboard/') || url.pathname.includes('/supabase')){
    // event.respondWith(
    // fetch(event.request).then(resp => { caches.open(CACHE_NAME).then(cache=>cache.put(event.request, resp.clone())); return resp.clone(); }).catch(()=>caches.match(event.request))
    // );
    // return;
// }
    
// App shell: cache-first
// event.respondWith(
//     caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
//     caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone())); return resp.clone();
//     })).catch(()=>caches.match('/index.html'))
//     );
// });

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (url.origin === location.origin) {
      e.respondWith(
        caches.match(e.request).then(resp => resp || fetch(e.request))
      );
    } else {
      // network first for external (Supabase, analytics)
      e.respondWith(
        fetch(e.request)
          .then(resp => {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            return resp;
          })
          .catch(() => caches.match(e.request))
      );
    }
  });

  


