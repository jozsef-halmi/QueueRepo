var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var EditController = (function () {
            function EditController($scope, $webApiService, $sessionStorage, $routeParams, $location) {
                var _this = this;
                this.$scope = $scope;
                this.$webApiService = $webApiService;
                this.$sessionStorage = $sessionStorage;
                this.$routeParams = $routeParams;
                this.$location = $location;
                $webApiService.GetAnimal($routeParams['animalId']).then(function (response) {
                    _this._id = response._id;
                    _this.type = response.IsLost ? "Lost" : "Found";
                    _this.sex = response.Sex;
                    _this.longDescr = response.LongDescription;
                    _this.shortDescr = response.ShortDescription;
                    _this.imageUrl = response.ImageURL;
                    _this.name = response.Name;
                });
            }
            EditController.prototype.editAnimal = function () {
                this.$webApiService.EditAnimal(this._id, this.name, this.shortDescr, this.longDescr, this.sex, this.type, this.imageUrl);
                this.$location.path('/welcome');
            };
            return EditController;
        }());
        Controllers.EditController = EditController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        //import Services = Application.Services;
        var LoginController = (function () {
            function LoginController($scope, $rootScope, $interval, $modal, $location, $communicationService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$interval = $interval;
                this.$modal = $modal;
                this.$location = $location;
                this.$communicationService = $communicationService;
                //this.myService = myService;
                this.data = [1, 2, 3, 4, 5];
            }
            // Start a session
            LoginController.prototype.RegisterSession = function () {
                //console.info(this.$communicationService);
                this.$communicationService.RegisterSession(this.email);
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
/// <reference path="../../scripts/typings/signalr/signalr.d.ts" />
var Application;
(function (Application) {
    var Common;
    (function (Common) {
        var Implementations;
        (function (Implementations) {
            var QueueHubProxy = (function () {
                function QueueHubProxy(_url, $rootScope, $sessionStorage) {
                    this.$rootScope = $rootScope;
                    this.$sessionStorage = $sessionStorage;
                    this.url = _url;
                    this.client = new QueueClient();
                    this.server = new QueueServer(_url, this.client, $rootScope, $sessionStorage);
                }
                return QueueHubProxy;
            }());
            Implementations.QueueHubProxy = QueueHubProxy;
            var QueueClient = (function () {
                function QueueClient() {
                }
                QueueClient.prototype.onRegisterComplete = function (sessionId, numberAhead) {
                    console.info('Register. Number ahead: ' + numberAhead);
                };
                QueueClient.prototype.allowEntrance = function () {
                    console.info('Allow entrance');
                };
                QueueClient.prototype.denyEntrance = function () {
                    console.info('Deny entrance');
                };
                QueueClient.prototype.notifyClient = function (numberAhead) {
                    console.info('Notify');
                };
                return QueueClient;
            }());
            var QueueServer = (function () {
                function QueueServer(_url, client, $rootScope, $sessionStorage) {
                    var _this = this;
                    this.client = client;
                    this.$rootScope = $rootScope;
                    this.$sessionStorage = $sessionStorage;
                    this.url = _url;
                    this.connect();
                    // Register callbacks
                    this.hubProxy.on('onRegisterComplete', function (sessionId, n) { return _this.client.onRegisterComplete(sessionId, n); });
                    this.hubProxy.on('allowEntrance', function () { return _this.client.allowEntrance(); });
                    this.hubProxy.on('notifyClient', function (n) { return _this.client.notifyClient(n); });
                    $rootScope.$on('connected', function () {
                        // Test enter
                        _this.knock(_this.$sessionStorage.sessionId);
                    });
                }
                QueueServer.prototype.registerSession = function (name) {
                    this.hubProxy.invoke('RegisterSession', name).done(function (result) {
                        console.info('Register Session message sent to QueueHub.');
                    }).fail(function (error) {
                        console.info('Error registering session.');
                    });
                };
                ;
                QueueServer.prototype.heartBeat = function () {
                    this.hubProxy.invoke('HeartBeat').done(function (result) {
                        console.info('HeartBeat sent.');
                    }).fail(function (error) {
                        console.info('Error sending heartbeat.');
                    });
                };
                ;
                QueueServer.prototype.knock = function (sessionId) {
                    if (this.connection.state == 1) {
                        var rootScope = this.$rootScope;
                        this.hubProxy.invoke('KnockAt', sessionId).done(function (result) {
                            if (result) {
                                rootScope.$broadcast('knock-allow');
                            }
                            else {
                                rootScope.$broadcast('knock-deny');
                            }
                            console.info('Knock result: ' + result);
                        }).fail(function (error) {
                            console.info('Error knocking.');
                        });
                    }
                };
                QueueServer.prototype.connect = function () {
                    this.connection = $.hubConnection(url, { useDefaultPath: false });
                    this.hubProxy = this.connection.createHubProxy('QueueHub');
                    var rootScope = this.$rootScope;
                    this.connection.start()
                        .done(function () {
                        console.info("Successfully joined to QueueHub");
                        rootScope.$broadcast('connected');
                        //registerSession('Bela');
                    })
                        .fail(function (error) {
                        console.error('Error connecting to QueueHub.' + error);
                    });
                };
                ;
                QueueServer.$inject = ['$rootScope'];
                return QueueServer;
            }());
        })(Implementations = Common.Implementations || (Common.Implementations = {}));
    })(Common = Application.Common || (Application.Common = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var CommunicationService = (function () {
            function CommunicationService($rootScope, $interval, $modal, $location, $sessionStorage) {
                var _this = this;
                this.$rootScope = $rootScope;
                this.$interval = $interval;
                this.$modal = $modal;
                this.$location = $location;
                this.$sessionStorage = $sessionStorage;
                console.info('Service ctor');
                console.info('session: ' + $sessionStorage.sessionId);
                console.info('Email: ' + $sessionStorage.email);
                this.queue = new Application.Common.Implementations.QueueHubProxy(url, $rootScope, $sessionStorage);
                this.queue.client.onRegisterComplete = function (sessionId, n) {
                    console.info('Waiting count: ' + n);
                    console.info('SessionId: ' + sessionId);
                    $sessionStorage.sessionId = sessionId;
                    // Open modal
                    var options = {
                        templateUrl: 'Views/Modals/WaitingModal.html' //,
                        ,
                        controller: Application.Controllers.WaitingModalController,
                        controllerAs: 'modal',
                        resolve: {
                            numberInLine: function () { return n; } // <- this will pass the same instance 
                        },
                        size: 'lg'
                    };
                    _this.modalInstance = _this.$modal.open(options);
                    //this.$modal.open(options).result
                    //    .then(() => console.info('then'));
                };
                this.queue.client.allowEntrance = function () {
                    console.log('allow entrance');
                    _this.modalInstance.close();
                    $location.path('/welcome');
                };
                this.queue.client.notifyClient = function (n) {
                    console.info('NumberAhead: ' + n);
                    $rootScope.$broadcast('number-ahead', { numberInLine: n });
                };
                $rootScope.$on('knock-allow', function () {
                    console.info('allow knock');
                });
                $rootScope.$on('knock-deny', function () {
                    console.info('deny knock');
                    $rootScope.$apply(function () {
                        $location.path('/index');
                        console.log($location.path());
                    });
                    console.info('deny knock');
                });
            }
            CommunicationService.prototype.RegisterSession = function (email) {
                console.info('register session, email: ' + email);
                this.$sessionStorage.email = email;
                this.queue.server.registerSession(email);
                this.startHeartBeat();
            };
            CommunicationService.prototype.startHeartBeat = function () {
                var _this = this;
                var intervalFn = function () {
                    _this.queue.server.heartBeat();
                };
                this.$interval(intervalFn, 1000);
            };
            CommunicationService.prototype.knock = function () {
                this.queue.server.knock(this.$sessionStorage.sessionId);
            };
            CommunicationService.$inject = ["$rootScope", "$interval", "$uibModal", '$location', '$sessionStorage'];
            return CommunicationService;
        }());
        Services.CommunicationService = CommunicationService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var WebApiService = (function () {
            function WebApiService($http, $q) {
                this.$http = $http;
                this.$q = $q;
                console.info('WebApiService ctor');
                this.baseUrl = "http://localhost:1337";
                this.apiBaseUrl = this.baseUrl + "/api/";
            }
            ;
            WebApiService.prototype.ListCities = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.apiBaseUrl + 'cities')
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got cities from web api');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting cities. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.ListAnimals = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.apiBaseUrl + 'animals')
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animals from web api');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animals. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.GetAnimal = function (animalId) {
                var deferred = this.$q.defer();
                this.$http.get(this.apiBaseUrl + 'animal' + '/' + animalId)
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animal from web api');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animal. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.ListAnimalsForUser = function (user) {
                var deferred = this.$q.defer();
                this.$http.get(this.apiBaseUrl + 'animals' + '/' + user)
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animals for user from web api');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animals. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.AddAnimal = function (user, name, shortDescr, longDescr, sex, type, imageUrl, city) {
                var deferred = this.$q.defer();
                this.$http.post(this.apiBaseUrl + 'addanimal', {
                    userID: user,
                    name: name,
                    longDescr: longDescr,
                    shortDescr: shortDescr,
                    type: type,
                    sex: sex,
                    imageURL: imageUrl,
                    city: city
                })
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Add animal request sent');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while adding new animal. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.EditAnimal = function (id, name, shortDescr, longDescr, sex, type, imageUrl) {
                var deferred = this.$q.defer();
                this.$http.post(this.apiBaseUrl + 'editanimal', {
                    _id: id,
                    name: name,
                    longDescr: longDescr,
                    shortDescr: shortDescr,
                    type: type,
                    sex: sex,
                    imageURL: imageUrl
                })
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Edit animal request sent');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while editing animal. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.prototype.DeleteAnimal = function (animalId) {
                var deferred = this.$q.defer();
                this.$http.post(this.apiBaseUrl + 'deleteanimal', {
                    animalID: animalId
                })
                    .success(function (response) {
                    deferred.resolve(response);
                    console.info('Delete animal request successfully sent.');
                })
                    .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while deleting an animal. ' + JSON.stringify(err));
                });
                return deferred.promise;
            };
            WebApiService.$inject = ["$http", "$q"];
            return WebApiService;
        }());
        Services.WebApiService = WebApiService;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var City = (function () {
            function City() {
            }
            return City;
        }());
        Models.City = City;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var UploadController = (function () {
            function UploadController($scope, $webApiService, $sessionStorage, $location) {
                var _this = this;
                this.$scope = $scope;
                this.$webApiService = $webApiService;
                this.$sessionStorage = $sessionStorage;
                this.$location = $location;
                $webApiService.ListCities().then(function (response) {
                    _this.cities = response;
                });
            }
            UploadController.prototype.addAnimal = function () {
                this.$webApiService.AddAnimal(this.$sessionStorage.email, this.name, this.shortDescr, this.longDescr, this.sex, this.type, this.imageUrl, this.selectedCity.Name);
                this.$location.path('/welcome');
            };
            return UploadController;
        }());
        Controllers.UploadController = UploadController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
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
appModule.controller("MainController", ["$scope", "CommunicationService", function ($scope, $communicationService) { return new Application.Controllers.MainController($scope, $communicationService); }]);
appModule.controller("LoginController", ["$scope", "$rootScope", "$interval", "$uibModal", '$location', 'CommunicationService',
    function ($scope, $rootScope, $interval, $uibModal, $location, $communicationService) {
        return new Application.Controllers.LoginController($scope, $rootScope, $interval, $uibModal, $location, $communicationService);
    }]);
appModule.controller("IndexController", ["CommunicationService", "WebApiService", "$scope",
    function ($communicationService, $webApiService, $scope) { return new Application.Controllers.IndexController($communicationService, $webApiService, $scope); }]);
appModule.controller("MyUploadsController", ["CommunicationService", "WebApiService", "$scope", "$sessionStorage", "$location",
    function ($communicationService, $webApiService, $scope, $sessionStorage, $location) { return new Application.Controllers.MyUploadsController($communicationService, $webApiService, $scope, $sessionStorage, $location); }]);
appModule.controller("UploadController", ["$scope", "WebApiService", "$sessionStorage", "$location",
    function ($scope, $webApiService, $sessionStorage, $location) { return new Application.Controllers.UploadController($scope, $webApiService, $sessionStorage, $location); }]);
appModule.controller("EditController", ["$scope", "WebApiService", "$sessionStorage", "$routeParams", "$location",
    function ($scope, $webApiService, $sessionStorage, $routeParams, $location) { return new Application.Controllers.EditController($scope, $webApiService, $sessionStorage, $routeParams, $location); }]);
var url = "http://localhost:8098/signalr";
appModule.config(['$routeProvider',
    function routes($routeProvider) {
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
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/angularjs/angular.d.ts" />
/// <reference path="typings/angularjs/angular-route.d.ts" />
/// <reference path="../controllers/editcontroller.ts" />
/// <reference path="typings/ngstorage/ngstorage.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../controllers/logincontroller.ts" />
/// <reference path="../common/interfaces/iqueuehubproxy.ts" />
/// <reference path="../common/implementations/queuehubproxy.ts" />
/// <reference path="typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../service/communicationservice.ts" />
/// <reference path="../service/webapiservice.ts" />
/// <reference path="../models/animal.ts" />
/// <reference path="../controllers/uploadcontroller.ts" />
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var IndexController = (function () {
            function IndexController($communicationService, $webApiService, $scope) {
                var _this = this;
                this.$communicationService = $communicationService;
                this.$webApiService = $webApiService;
                this.$scope = $scope;
                //this.animals = [new Application.Models.Animal(), new Application.Models.Animal()];
                this.ListAnimals();
                this.animalCount = 3;
                this.currentPage = 1;
                $scope.$watch('animalCount', function () {
                    if (_this.animals) {
                        _this.filterAnimals();
                    }
                });
            }
            IndexController.prototype.filterAnimals = function () {
                if (this.query) {
                    this.filteredAnimals = this.animals;
                }
                else {
                    var animalStart = (this.currentPage - 1) * this.animalCount;
                    var animalEnd = ((this.currentPage) * this.animalCount) > this.animals.length ? this.animals.length : ((this.currentPage) * this.animalCount);
                    this.filteredAnimals = this.animals.slice(animalStart, animalEnd);
                }
                //console.info(this.animals)
                //console.info('from: ' + this.animalStart.toString() + ', to: ' + (this.animalEnd).toString())
                //console.info(this.filteredAnimals)
            };
            IndexController.prototype.SaveAnimals = function (_animals) {
                this.animals = _animals;
                var i;
                for (i = 0; i < this.animals.length; i++) {
                    if (this.animals[i].ImageURL.indexOf('http://') == -1
                        && this.animals[i].ImageURL.indexOf('https://') == -1) {
                        this.animals[i].ImageURL = this.$webApiService.baseUrl + this.animals[i].ImageURL;
                    }
                }
                this.filterAnimals();
            };
            IndexController.prototype.ListAnimals = function () {
                var _this = this;
                var that = this;
                this.$webApiService.ListAnimals()
                    .then(function (result) { return _this.SaveAnimals(result); })
                    .catch(function (err) { return console.error(err); });
            };
            return IndexController;
        }());
        Controllers.IndexController = IndexController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var MainController = (function () {
            function MainController($scope, $communicationService) {
                this.$scope = $scope;
                this.$communicationService = $communicationService;
                console.info('Main controller ctor');
                $scope.$on('$locationChangeStart', function (event) {
                    // Check if entrance is allowed.
                    console.info('locchangestart');
                    $communicationService.knock();
                });
            }
            return MainController;
        }());
        Controllers.MainController = MainController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        //import Services = Application.Services;
        var WaitingModalController = (function () {
            function WaitingModalController(numberInLine, $rootScope, $scope) {
                this.$rootScope = $rootScope;
                this.$scope = $scope;
                $scope.NumberAhead = numberInLine;
                $rootScope.$on('number-ahead', function (event, args) {
                    $scope.NumberAhead = args.numberInLine;
                    console.info('numberahead updated: ' + $scope.NumberAhead);
                    //$scope.$apply();
                });
            }
            return WaitingModalController;
        }());
        Controllers.WaitingModalController = WaitingModalController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var MyUploadsController = (function () {
            function MyUploadsController($communicationService, $webApiService, $scope, $sessionStorage, $location) {
                this.$communicationService = $communicationService;
                this.$webApiService = $webApiService;
                this.$scope = $scope;
                this.$sessionStorage = $sessionStorage;
                this.$location = $location;
                this.ListAnimals();
            }
            MyUploadsController.prototype.SaveAnimals = function (_animals) {
                this.animals = _animals;
                var i;
                for (i = 0; i < this.animals.length; i++) {
                    if (this.animals[i].ImageURL.indexOf('http://') == -1
                        && this.animals[i].ImageURL.indexOf('https://') == -1) {
                        this.animals[i].ImageURL = this.$webApiService.baseUrl + this.animals[i].ImageURL;
                    }
                }
            };
            MyUploadsController.prototype.ListAnimals = function () {
                var _this = this;
                var that = this;
                this.$webApiService.ListAnimalsForUser(this.$sessionStorage.email)
                    .then(function (result) { return _this.SaveAnimals(result); })
                    .catch(function (err) { return console.error(err); });
            };
            MyUploadsController.prototype.RemoveAnimal = function (animalId) {
                var _this = this;
                console.info('remove');
                this.$webApiService.DeleteAnimal(animalId)
                    .catch(function (err) { return console.error(err); })
                    .finally(function () { return _this.$location.path('/welcome/'); });
                this.$location.path('/welcome/');
            };
            MyUploadsController.prototype.EditAnimal = function (animalId) {
                this.$location.path('/edit/' + animalId);
            };
            return MyUploadsController;
        }());
        Controllers.MyUploadsController = MyUploadsController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
var Application;
(function (Application) {
    var Models;
    (function (Models) {
        var Animal = (function () {
            function Animal() {
            }
            return Animal;
        }());
        Models.Animal = Animal;
    })(Models = Application.Models || (Application.Models = {}));
})(Application || (Application = {}));
//# sourceMappingURL=allScripts.js.map