module Application.Controllers {
    
    export class EditController {
        public type: string;
        public sex: string;
        public longDescr: string;
        public shortDescr: string;
        public imageUrl: string;
        public name: string;
        public _id: string;
        public cities: Application.Models.City[];
        public selectedCity: Application.Models.City;
        constructor(private $scope: ng.IScope
            , private $webApiService: Application.Services.WebApiService
            , private $sessionStorage: Application.Storage.IQueueStorage
            , private $routeParams: ng.route.IRouteParamsService
            , private $location: ng.ILocationService        ) {
            $webApiService.GetAnimal($routeParams['animalId']).then((response: Application.Models.Animal) => {
                this._id = response._id;
                this.type = response.IsLost ? "Lost" : "Found";
                this.sex = response.Sex;
                this.longDescr = response.LongDescription;
                this.shortDescr = response.ShortDescription;
                this.imageUrl = response.ImageURL;
                this.name = response.Name;
           
            });
        }



        public editAnimal()
        {
            this.$webApiService.EditAnimal(this._id
                , this.name
                , this.shortDescr
                , this.longDescr
                , this.sex
                , this.type
            , this.imageUrl);
            this.$location.path('/welcome');
        }
                //this.$webApiService.EditAnimal(animalId, null,null,null,null,null,null)
            //    .then(() => console.info('Delete success'))
            //    .catch((err) => console.error(err));


    }
}