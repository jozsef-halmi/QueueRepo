module Application.Services {
    export class WebApiService {
        public baseUrl: string;
        public apiBaseUrl: string;

        static $inject = ["$http", "$q"];
        constructor(private $http: ng.IHttpService
            , private $q: ng.IQService) {
            console.info('WebApiService ctor')
            this.baseUrl = "http://localhost:1337";
            this.apiBaseUrl = this.baseUrl + "/api/";
        };

        public ListCities() {
            var deferred = this.$q.defer();

            this.$http.get(this.apiBaseUrl + 'cities')
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got cities from web api');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting cities. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public ListAnimals() {
            var deferred = this.$q.defer();

            this.$http.get(this.apiBaseUrl + 'animals')
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animals from web api');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animals. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public GetAnimal(animalId) {
            var deferred = this.$q.defer();

            this.$http.get(this.apiBaseUrl + 'animal'+'/'+animalId)
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animal from web api');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animal. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public ListAnimalsForUser(user: string) {

            var deferred = this.$q.defer();

            this.$http.get(this.apiBaseUrl + 'animals' + '/' + user)
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Got animals for user from web api');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while getting animals. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public AddAnimal(user: string, name: string, shortDescr: string, longDescr: string,
            sex: string, type: string, imageUrl: string, city: string) {

            var deferred = this.$q.defer();

            this.$http.post(this.apiBaseUrl + 'addanimal',
                {
                    userID: user,
                    name: name,
                    longDescr: longDescr,
                    shortDescr: shortDescr,
                    type: type,
                    sex: sex,
                    imageURL: imageUrl,
                    city: city
                }
            )
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Add animal request sent');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while adding new animal. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public EditAnimal(id: string, name: string, shortDescr: string, longDescr: string,
            sex: string, type: string, imageUrl: string) {

            var deferred = this.$q.defer();

            this.$http.post(this.apiBaseUrl + 'editanimal',
                {
                    _id: id,
                    name: name,
                    longDescr: longDescr,
                    shortDescr: shortDescr,
                    type: type,
                    sex: sex,
                    imageURL: imageUrl
                }
            )
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Edit animal request sent');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while editing animal. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

        public DeleteAnimal(animalId: string) {

            var deferred = this.$q.defer();

            this.$http.post(this.apiBaseUrl + 'deleteanimal',
                {
                    animalID: animalId
                }
            )
                .success(function (response) {
                    deferred.resolve(response);
                    console.info('Delete animal request successfully sent.');
                })
                .error(function (err, status) {
                    deferred.reject(err);
                    console.info('Error while deleting an animal. ' + JSON.stringify(err))
                });

            return deferred.promise;
        }

    }
}