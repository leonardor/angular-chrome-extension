
var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngSanitize']);

myApp.config(function ($routeProvider, $mdThemingProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: chrome.extension.getURL('templates/home.html'), 
      controller: 'MainCtrl'
    })
    .when('/settings', {
      templateUrl: chrome.extension.getURL('templates/settings.html'),
      controller: 'SettingsCtrl'
    })
    .when('/solr', {
      templateUrl: chrome.extension.getURL('templates/solr.html'),
      controller: 'SolrCtrl'
    })
    .when('/tools', {
      templateUrl: chrome.extension.getURL('templates/tools.html'),
      controller: 'ToolsCtrl'
    })
    .when('/db', {
      templateUrl: chrome.extension.getURL('templates/db.html'),
      controller: 'DbCtrl'
    })
    .otherwise({
        redirectTo: '/home'
    });

    $mdThemingProvider.alwaysWatchTheme(true);
}).run(function () {
});

myApp.service('pageInfoService', function () {
    this.getInfo = function (callback) {
        var model = {};

        chrome.tabs.query({'active': true}, function (tabs) {
            if (tabs.length > 0) {
                model.title = tabs[0].title;
                model.url = tabs[0].url;

                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.content = response;
                    callback(model);
                });
            }
        });
    };
});

myApp.service('productInfoService', function () {
    this.getInfo = function (callback) {
        var model = {};

        chrome.tabs.query({'active': true}, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'ProductInfo' }, function (response) {
                    model = response;
                    callback(model);
                });
            }
        });
    };
});

myApp.factory('pageService', function () {
    var pageService = {};

    pageService.getType = function (scope, callback) {
        angular.forEach(scope.tab.content.metas, function (meta) {
            if(meta.type == 'property') {
                if(meta.property == 'og:type') {
                    callback(meta.content);
                }
            }
        });
    };

    return pageService;
});

var BaseCtrl = function ($scope, $route, $routeParams, $location) {
    $scope.path = function () {
      return $location.absUrl();
    };
    $scope.setRoute = function(route) {
        $location.path(route);
    };
    $scope.isRoute = function(route) {
        return ($location.path() == '/' + route)?true:false;
    };

    $scope.data = {};
    $scope.selectedIndex = 0;

    $scope.$watch('selectedIndex', function(current, old) {
        console.log($scope.selectedIndex);
    });

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
};

myApp.controller('MainCtrl', function ($scope, $sce, $injector, pageInfoService, pageService, productInfoService) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});

    $scope.tab = {};
    $scope.page = null;
    $scope.data = { info: {} };

    $scope.$on('typeEvent', function(event, args) {
        if(args.type == 'product') {
            productInfoService.getInfo(function (info) {
                $scope.data.info = info;

                $scope.$apply();
            });
        }
    });

    $scope.$on('pageEvent', function(event, args) {
        pageService.getType($scope, function (type) {
            $scope.$emit('typeEvent', { type: type });
        });
    });

    pageInfoService.getInfo(function (info) {
        $scope.tab.title = info.title;
        $scope.tab.url = info.url;
        $scope.tab.content = info.content;

        $scope.$emit('pageEvent');

        $scope.$apply();
    });

});

myApp.controller('SettingsCtrl', function ($scope, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});
});

myApp.controller('SolrCtrl', function ($scope, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});
});

myApp.controller('ToolsCtrl', function ($scope, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});
});

myApp.controller('DbCtrl', function ($scope, $injector) {
    $injector.invoke(BaseCtrl, this, {$scope: $scope});
});