/// <reference path="scripts/_all.ts" />

// Services
var servicesModule = angular.module("Services", []);
servicesModule.service('CommunicationService', Application.Services.CommunicationService);
servicesModule.service('WebApiService', Application.Services.WebApiService);

var appModule = angular.module("myApp", ['ui.bootstrap', 'ngRoute', 'Services', 'ngStorage', 'ngAnimate']);

//appModule.controller("MainController", ["$scope", "$interval", "$uibModal", '$location',
//    ($scope, $interval, $uibModal, $location) =>
//        new Application.Controllers.LoginController($scope, $interval, $uibModal, $location)]);



//appModule.factory("MyService", ["$http", "$location", ($http, $location)
//    => new Application.Services.MyService($http, $scope)]);

// Controller registrations
appModule.controller("MainController", ["$scope", "CommunicationService", ($scope, $communicationService) => new Application.Controllers.MainController($scope, $communicationService)]);
appModule.controller("LoginController", ["$scope", "$rootScope", "$interval", "$uibModal", '$location', 'CommunicationService',
    ($scope, $rootScope, $interval, $uibModal, $location, $communicationService) =>
        new Application.Controllers.LoginController($scope, $rootScope, $interval, $uibModal, $location, $communicationService)]);
appModule.controller("IndexController", ["CommunicationService", "WebApiService", "$scope",
    ($communicationService, $webApiService, $scope) => new Application.Controllers.IndexController($communicationService, $webApiService, $scope)]);
appModule.controller("MyUploadsController", ["CommunicationService", "WebApiService", "$scope", "$sessionStorage", "$location",
    ($communicationService, $webApiService, $scope, $sessionStorage, $location) => new Application.Controllers.MyUploadsController($communicationService, $webApiService, $scope, $sessionStorage, $location)]);
appModule.controller("UploadController",
    ["$scope", "WebApiService", "$sessionStorage", "$location",
        ($scope, $webApiService, $sessionStorage, $location) => new Application.Controllers.UploadController($scope, $webApiService, $sessionStorage, $location)]);
appModule.controller("EditController",
    ["$scope", "WebApiService", "$sessionStorage", "$routeParams", "$location",
        ($scope, $webApiService, $sessionStorage, $routeParams, $location) => new Application.Controllers.EditController($scope, $webApiService, $sessionStorage, $routeParams, $location)]);




var url = "http://localhost:8098/signalr";

appModule.config(['$routeProvider',
    function routes($routeProvider: ng.route.IRouteProvider) { // *** $routeProvider is typed with ng.route.IRouteProvider ***
        $routeProvider
            .when('/index', {
                templateUrl: 'Views/Login.html',
                controller: 'LoginController as lc'
            })
            .when('/welcome', {
                templateUrl: 'Views/index.html',
                controller: 'IndexController as ctrl'
            })
            .when('/myuploads', {
                templateUrl: 'Views/MyUploads.html',
                controller: 'MyUploadsController as ctrl'
            })
            .when('/upload', {
                templateUrl: 'Views/Upload.html',
                controller: 'UploadController as ctrl'
            })
            .when('/edit/:animalId', {
                templateUrl: 'Views/Edit.html',
                controller: 'EditController as ctrl'
            })
            .otherwise({
                redirectTo: '/index'
            });
    }
]);
//queue.server.registerSession('Bela');

//var queue = $.connection.queueHub;
//queue.server.registerSession = function (name: string) {
    
//};


//$.connection.hub.start().done(function () {

//     queue.server.registerSession("abcd");
  
//});


//var connection = $.hubConnection(url, { useDefaultPath: false });
//var hubProxy = connection.createHubProxy('QueueHub');


//connection.start()
//    .done(function () {
//        var successMsg = "Successfully joined to cardreader";
//        console.info(successMsg);

//        hubProxy.invoke('RegisterSession', 'abcd').done(function (result) {
//            console.info('Card eject request successfully sent.')
//        }
//        ).fail(function (error) {
//            console.info('error')
//            // logService.LogError({ Message: 'Error while sending card reject request to the card service: ' + JSON.stringify(error) });
//        });

//    })
//    .fail(function (error) {

//        var failMsg = 'CardReaderService connection error.' + error;
//        console.error(failMsg);
//    });



//appModule.factory("MyService", ["$http", "$location", ($http, $location)
//    => new Application.Services.MyService($http, $scope)]);

//appModule.directive("myDirective", ()
//    => new Application.Directives.MyDirective());