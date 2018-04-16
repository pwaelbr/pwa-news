(function(){
    'use strict';

    //definir a hora que o baner para a instalacao aparece
    var eventIntall;
    var btInstall = $("#btn-install");
    btInstall.hide();
    window.addEventListener('beforeinstallprompt', function(event){
        console.log("INSTALL")
        eventIntall = event;
        event.preventDefault();
        btInstall.show();
    });

    btInstall.click(function(){
        if (eventIntall){
            eventIntall.prompt();

            eventIntall.userChoice.then(function(choiceResult){
                if(choiceResult == "dismssed"){
                    alert("Que pena!)");
                } else {
                    alert("Valeu!");
                }
            });

            eventIntall = null;
            btInstall.hide();
        }
    });
})();