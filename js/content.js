//alert('content script loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == 'PageInfo') {
        var info = { metas: [], links: [] };

        angular.forEach(angular.element(document.querySelectorAll('meta')), function (el) {
            var meta = {};

            meta.name = el.getAttribute('name');
            meta.property = el.getAttribute('property');
            meta.content = el.getAttribute('content');

            switch(true) {
                case (meta.name != null):
                    meta.type = 'name';
                break;
                case (meta.property != null):
                    meta.type = 'property';
                break;
                default:
                    meta.type = null;
                break;
            }

            info.metas.push(meta);
        });

        angular.forEach(angular.element(document.querySelectorAll('a')), function (el) {
            var link = {};

            var href = el.getAttribute('href');

            if (href != null && href.indexOf("http") == 0) {
                link.url = href;
                //only add urls that start with http
                info.links.push(link);
            }
        });

        sendResponse(info);
    } else if (request.action == 'ProductInfo') {
        var info = { title: '', price: '', image: '' };

        if(document.querySelectorAll('#product-info').length > 0) {
            var title = angular.element(document.querySelector('#product-info').querySelector('#offer-title').querySelector('h1'));

            info.title = title.text();

            var image = angular.element(document.querySelector('#product-info').querySelector("[itemprop='image']"))[0];

            info.image = window.location.protocol + image.getAttribute('src');
        
            var price = document.querySelector('#product-info').querySelector("[itemprop='price']");

            info.price = angular.element(price.querySelector('.money-int')).text() + " <sup>" + angular.element(price.querySelector('.money-decimal')).text() + "</sup> " + angular.element(price.querySelector('.money-currency')).text();
        
            info.resealed = [];

            angular.forEach(angular.element(document.querySelector('#product-resealed').querySelector('#resealed-container').querySelectorAll('tr')), function (el) {
                var image = el.querySelector('img');

                var price = el.querySelector('.resealed-price');

                info.resealed.push({ image: window.location.protocol + image.getAttribute('src'), price: angular.element(price.querySelector('.money-int')).text() + " <sup>" + angular.element(price.querySelector('.money-decimal')).text() + "</sup> " + angular.element(price.querySelector('.money-currency')).text() });
            });
        }

        sendResponse(info);
    }
});