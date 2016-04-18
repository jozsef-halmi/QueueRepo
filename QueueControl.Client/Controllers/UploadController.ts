module Application.Controllers {
    
    export class UploadController {
        public type: string;
        public sex: string;
        public longDescr: string;
        public shortDescr: string;
        public imageUrl: string;
        public name: string;

        public cities: Application.Models.City[];
        public selectedCity: Application.Models.City;
        constructor(private $scope: ng.IScope
            , private $webApiService: Application.Services.WebApiService
            , private $sessionStorage: Application.Storage.IQueueStorage
            , private $location: ng.ILocationService) {

            $webApiService.ListCities().then((response: Application.Models.City[]) => {
                this.cities = response;
            });
        }

        public addAnimal()
        {
            this.$webApiService.AddAnimal(this.$sessionStorage.email
                , this.name
                , this.shortDescr
                , this.longDescr
                , this.sex
                , this.type
                , this.imageUrl
                , this.selectedCity.Name);
            this.$location.path('/welcome');
        }
        


    }
}