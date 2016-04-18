/// <reference path="scripts/_all.ts" />
var appModule = angular.module("myApp", []);
appModule.controller("MyController", ["$scope",
    function ($scope) { return new Application.Controllers.MyController($scope); }]);
//appModule.factory("MyService", ["$http", "$location", ($http, $location)
//    => new Application.Services.MyService($http, $scope)]);
//appModule.directive("myDirective", ()
//    => new Application.Directives.MyDirective()); 
//# sourceMappingURL=app.js.map