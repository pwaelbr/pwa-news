(function () {
    'use strict';

    var category = null;
    var search = null;

    var API = 'https://newsapi.org/v2/';
    var ENDPOINT_HEADLINES = 'top-headlines?';
    var ENDPOINT_EVERYTHING = 'everything?';
    var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';

    getNews();

    //notificacao

    var permissionNotification = false;
    var btnAlert = $("#btn-alert");

    if('Notification' in window) { //verifica se existe
        permissionNotification = Notification.permission; // verifica se o usuario tem permissao
        console.log(permissionNotification);
        if (permissionNotification==='default'){
            btnAlert.show();
        }
        else{
            btnAlert.hide();
        }
            btnAlert.click(function () {
                
                Notification.requestPermission(function(perm){
                    permissionNotification = perm;
                });
            });
    }

    if("ondevicelight" in window){
        window.addEventListener("deviceLight", onUpdateDeviceLight);
    }else{
        console.log("Your device don't support");
    }

    var watchId;

    function appendLocation(location, verb) {
        verb = verb || 'updated';
        var newLocation = document.createElement('p');
        newLocation.innerHTML = 'Location ' + verb + ': <a href="https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>';
        console.log(newLocation);
        return (newLocation);
    }

    if ('geolocation' in navigator) {
        document.getElementById('btn-locale').addEventListener('click', function () {
          navigator.geolocation.getCurrentPosition(function (location) {
            console.log(appendLocation(location, 'fetched'));
          });
          watchId = navigator.geolocation.watchPosition(appendLocation);
        });
      } else {
        target.innerText = 'Geolocation API not supported.';
      }

    var titlePage = document.getElementById('titlePage');
    handleStateChange();
    console.log("TESTE");
    function handleStateChange() {
        var state = navigator.onLine ? 'online' : 'offline';
        titlePage.innerHTML += " ["+ state + ']';
    }

    function onUpdateDeviceLight(event){
        var colorPart = Math.min(255, event.value).toFixed(0);
        document.getElementById("body").style.backgroundColor = 
        "rgb(" + colorPart + ", " + colorPart + ", " + colorPart + ")";
    }

    function getNews() {
        var url = API + ENDPOINT_HEADLINES + 'country=br&' + API_KEY + getCategory();
        $.get(url, success);
    }

    function getNewsWithSearch() {
        var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
        $.get(url, success);
    }

    function success(data) {
        var divNews = $('#news');
        divNews.empty();
        setTopNews( data.articles[0]);
        for (var i = 1; i < data.articles.length; ++i) {
            divNews.append(getNewsHtml(data.articles[i]));
        }
    }

    function setTopNews(article) {
        if(article) {
            $('#top-news-title').text(article.title);
            $('#top-news-description').text(article.description);
            $('#top-news-image').attr('src', article.urlToImage).attr('alt', article.title);
            $('#top-news-link').attr('href', article.url);
        }
    }

    $("#headline").click(function () {
        category = null;
        activeMenu($(this));
    });
    $("#health").click(function () {
        category = 'health';
        activeMenu($(this));
    });
    $("#sports").click(function () {
        category = 'sports';
        activeMenu($(this));
    });
    $("#entertainment").click(function () {
        category = 'entertainment';
        activeMenu($(this));
    });
    $("#technology").click(function () {
        category = 'technology';
        activeMenu($(this));
    });
    $("#search").keypress(function (ev) {
        if (ev.which == 13) {
            search = $(this).val();
            if (search) {
                getNewsWithSearch();
            } else {
                getNews();
            }
        }
    });

    function activeMenu(menu) {
        search = null;
        $("#search").val('');
        $('li.active').removeClass('active');
        menu.addClass('active');
        getNews();
    }

    function getCategory() {
        if (category) {
            return '&category=' + category
        }
        return '';
    }

    function getSearch() {
        if (search) {
            return '&q=' + search
        }
        return '';
    }

    function getNewsHtml(article) {

        var card = $('<div>').addClass('card col-12 col-sm-2 col-md-3 col-lg-12');

        card = addImage(card);
        card = addBodyTitle(card);
        card = addBodyActions(card);

        return card;

        function addImage(card) {
            if (article.urlToImage) {
                return card.append(
                    $('<img>')
                        .attr('src', article.urlToImage)
                        .attr('alt', article.title)
                        .addClass('card-img-top')
                );
            }
            return card;
        }

        function addBodyTitle(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<h5>').addClass('card-title').append(article.title))
                    .append($('<h6>').addClass('card-subtitle mb-2 text-muted')
                        .append(moment(article.publishedAt).fromNow()))
                    .append($('<p>').addClass('card-text').append(article.description))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<button>').append('Read Article').addClass('btn btn-link').attr('type', 'button'))
                    .click(function () {
                        window.open(article.url, '_blank');
                    })
            );
        }
    }

})();