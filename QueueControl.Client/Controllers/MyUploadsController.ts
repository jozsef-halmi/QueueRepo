module Application.Controllers {
    export class MyUploadsController {
        public animals: Array<Application.Models.Animal>;


        constructor(private $communicationService: Application.Services.CommunicationService
            , private $webApiService: Application.Services.WebApiService
            , private $scope: ng.IScope
            , private $sessionStorage: Application.Storage.IQueueStorage
            , private $location: ng.ILocationService
        ) {
            this.ListAnimals();

        }


        public SaveAnimals(_animals: Array<Application.Models.Animal>) {

            this.animals = _animals;
            var i: number;
            for (i = 0; i < this.animals.length; i++) {
                if (this.animals[i].ImageURL.indexOf('http://') == -1
                    && this.animals[i].ImageURL.indexOf('https://') == -1) {
                    this.animals[i].ImageURL = this.$webApiService.baseUrl + this.animals[i].ImageURL;
                }
            }

        }

        public ListAnimals() {
            var that = this;
            this.$webApiService.ListAnimalsForUser(this.$sessionStorage.email)
                .then((result: Array<Application.Models.Animal>) => this.SaveAnimals(result))
                .catch((err) => console.error(err));
        }

        public RemoveAnimal(animalId: string) {
            console.info('remove')
            this.$webApiService.DeleteAnimal(animalId)

                .catch((err) => console.error(err))
                .finally(() =>  this.$location.path('/welcome/') 
            )
            this.$location.path('/welcome/');
        }

        public EditAnimal(animalId: string) {
            this.$location.path('/edit/' + animalId);
        }

    }
}