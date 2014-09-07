angular.module('G', ['ionic'])

    .value('appConf', {
        version: 1,
        apiHost: 'http://localhost:8080'
    })

    .config(function ($httpProvider, $urlRouterProvider, $stateProvider) {
        $httpProvider.interceptors.push('versionInterceptor');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'HomeController'
            })
            .state('upgrade', {
                url: '/upgrade',
                templateUrl: 'partials/upgrade.html',
                controller: 'UpgradeController'
            })
        ;

        $urlRouterProvider.otherwise('/home');

    })

    .run(function ($ionicPlatform, $rootScope, $state) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('wrong.version', function () {
            $state.go("upgrade");
        });
    })

    .controller('HomeController', function ($scope, $http, appConf) {
        $scope.someAction = function () {
            $http.get(appConf.apiHost + "/hello", function (data) {
                alert(data);
            });
        }
    })

    .controller('UpgradeController', function ($scope) {
        $scope.upgrade = function () {
            cordova.exec(null, null, "InAppBrowser", "open", [encodeURI("itms-services://?action=download-manifest&url=https://path/to/plist.plist"), "_system"]);
        }
    })

    .factory('versionInterceptor', function ($rootScope, appConf) {
        var versionInterceptor = {
            request: function (config) {
                config.url = config.url + '?_version=' + appConf.version;

                return config;
            },
            responseError: function(response) {
                if (response.status == 410) {
                    $rootScope.$emit('wrong.version');
                }
            }
        };

        return versionInterceptor;
    })
;
