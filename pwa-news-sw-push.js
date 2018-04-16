(function(){
'use strict';

self.addEventListener('notificationClick', function(event){
    setTimeout(function(){
        self.Notification.close();
    }, 2000);

    event.waitUntil(
        clients.openWindow('https://www.google.com')
    );
});

    self.addEventListener('push', function(event){
        var options = {
            body: 'Push notification'
        };
        event.waitUntil(
        self.registration.showNotification("Novas noticias", options)
        );
    });
})();

//Extensão Lighthouse