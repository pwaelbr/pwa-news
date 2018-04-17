(function(){
    'use strict'

    var CACHE_SHELL='pwa-news-shell-v1';
    var FILES_SHELL=[
        '/',
        '/css/core.css',
        '/css/main.css',
        '/image/placeholder-image.png',
        '/js/api.js',
        '/js/install-banner.js',
        '/js/push.js',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js'
    ];
    var API = 'http://localhost:';
    var CACHE_DATA = 'pw';
    self.addEventListener('install',function(event){
        event.waitUntil(
            self.caches.open(CACHE_SHELL)
            .then(function(cache){
                console.log(cache);
                return cache.addAll(FILES_SHELL);
            }).catch(function(err){
                console.log(err);
            })
        )

    });

    self.addEventListener('activate', function(e) {
        e.waitUntil(
          caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
              if (key !== CACHE_SHELL) {
                return caches.delete(key);
              }
            }));
          })
        );
        return self.clients.claim();
      });

    self.addEventListener('fetch', function(event){
        if(event.request.url.indexOf(API) === -1){
            event.respondWith(
                caches.match(event.request)
                .then(function(response){
                    if(response){
                        return response;
                    }
                    return fetch(event.request);
                })
            )
        }else{
            event.respondWith(
                self.fetch(event.request)
                .then(function(response){
                    return caches.open(CACHE_SHELL).then(function(){
                        cache.put(event.request.url, response.clone())
                        return response;
                    });
                }).catch(function(){
                    return caches.match(event.request);
                })
            )
        }
    });

    //PUSH

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();

        event.waitUntil(
            clients.openWindow('http://127.0.0.1:8887/')
        );
    });

    self.addEventListener('push', function (event) {
        console.log(event);
        var options = {
            body: event.data.text(),
            icon: 'image/apple-touch-icon.png',
            badge: 'images/badge.png'
        };
        event.waitUntil(
            self.registration.showNotification("Novas noticias", options)
        );
    });


}());
