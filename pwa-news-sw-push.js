(function () {
    'use strict';

    ///PUSH

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
})();

//Extensão Lighthouse