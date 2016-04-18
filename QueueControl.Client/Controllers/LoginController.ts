module Application.Controllers {

    //import Services = Application.Services;

    export class LoginController {
        //static $inject = ['$uibModal'];
        //myService: Services.IMyService;
        data: any;
        public text: string;
        public email: string;


        constructor(private $scope: ng.IScope
            , private $rootScope: ng.IRootScopeService
            //, myService: Services.IMyService
            , private $interval: ng.IIntervalService
            , private $modal: ng.ui.bootstrap.IModalService
            , private $location: ng.ILocationService
            , private $communicationService: Application.Services.CommunicationService
        ) {
            //this.myService = myService;
            this.data = [1, 2, 3, 4, 5];


        }

        // Start a session
        public RegisterSession() {
            //console.info(this.$communicationService);
            this.$communicationService.RegisterSession(this.email);
        }
        

        //private GetAll() {
        //    this.myService.GetAll((data) => {
        //        this.data = data;
        //    });
        //}
    }
}