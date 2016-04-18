module Application.Controllers {
    export class IndexController {
        public currentPage: number;
        public animalCount: number;
        public query: string;
        public animals: Array<Application.Models.Animal>;
        public filteredAnimals: Array<Application.Models.Animal>;
        constructor(private $communicationService: Application.Services.CommunicationService
            , private $webApiService: Application.Services.WebApiService
            , private $scope: ng.IScope
        ) {
            //this.animals = [new Application.Models.Animal(), new Application.Models.Animal()];
            this.ListAnimals();
            this.animalCount = 3;
            this.currentPage = 1;


            $scope.$watch('animalCount', () => {
                if (this.animals) {
                    this.filterAnimals();
                }
            });

        }

        public filterAnimals() {
            if (this.query) {
                this.filteredAnimals = this.animals;
            }
            else {
                var animalStart = (this.currentPage - 1) * this.animalCount;
                var animalEnd = ((this.currentPage) * this.animalCount) > this.animals.length ? this.animals.length : ((this.currentPage) * this.animalCount);
                this.filteredAnimals = this.animals.slice(animalStart, animalEnd)
            }

            //console.info(this.animals)
            //console.info('from: ' + this.animalStart.toString() + ', to: ' + (this.animalEnd).toString())
            //console.info(this.filteredAnimals)
        }


        public SaveAnimals(_animals: Array<Application.Models.Animal>) {
            this.animals = _animals;
            var i: number;
            for (i = 0; i < this.animals.length; i++)
            {
                if (this.animals[i].ImageURL.indexOf('http://') == -1
                    && this.animals[i].ImageURL.indexOf('https://') == -1) {
                    this.animals[i].ImageURL = this.$webApiService.baseUrl + this.animals[i].ImageURL;
                } 
            }

            this.filterAnimals();

        }

        public ListAnimals() {
            var that = this;
            this.$webApiService.ListAnimals()
                .then((result: Array<Application.Models.Animal>) => this.SaveAnimals(result))
                .catch((err) => console.error(err));
        }

    }
}