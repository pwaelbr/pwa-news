(function(){
    'use strict';

    var swPush;

    if('serviceWorker' in navigator && 'PushManager' in window){
        window.addEventListener('load', function(){
            navigator.serviceWorker.register('pwa-news-sw-push.js').then(function(swRegister){
                swPush = swRegister;

                console.log('Service worker push: Register ');

                getSubscription();
            });
        });
    }

    function getSubscription(){
        if(swPush){
            swPush.pushManager.getSubscription()
            .then(function(subscriptin){
                if(subscriptin){
                    console.log('User is subscribed');
                }else{
                    registerUser();
                }
            });
        }

    }

    function registerUser(){
        swPush.pushManager.subscribe({
            userVisiblenOnly:true,
            applicationServerKey:  "urlB6"
        }).then(function(subscriptin){
            console.log(JSON.stringify(subscriptin));
        });
    }



})();