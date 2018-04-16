
var filesToCache = [
    '/css/core.css',
    '/css/main.css',
    '/js/api.js',
    '/image/placeholder-image.png',
    '/library/jquery-3.3.1.min.js',
    '/library/moment.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js',
    '/'
];

var cacheName = 'weatherPWA-step-6-1';

var API = '';
var CACHE_DATA = 'pw';

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });


  self.addEventListener('fetch', function(event){
    console.log('[ServiceWorker] Fetch', event.request.url);

    if(event.request.url.indexOf(API) === -1){
        event.respondWith(caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }
            return fetch (event.request);
        }))
    } else {
        event.respondWith(
            self.fetch(event.request)
            .then(function(response){
                return caches.open(CACHE_DATA).then(function(){
                    cache.put(event.request.url, response.clone())
                    return response;
                })
            }).catch(function(){
                return caches.match(event.request);
            })
        )

    }

  });
