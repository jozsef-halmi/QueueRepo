module Application.Services {
    export class CommunicationService {
       
        queue: IQueueHubProxy;
        modalInstance: ng.ui.bootstrap.IModalServiceInstance;


        static $inject = ["$rootScope", "$interval", "$uibModal", '$location', '$sessionStorage'];
        constructor(
            private $rootScope: ng.IRootScopeService
            , private $interval: ng.IIntervalService
            , private $modal: ng.ui.bootstrap.IModalService
            , private $location: ng.ILocationService
            , private $sessionStorage: Application.Storage.IQueueStorage) {
            console.info('Service ctor')

        
            console.info('session: ' + $sessionStorage.sessionId);
            console.info('Email: ' + $sessionStorage.email)
            this.queue = new Application.Common.Implementations.QueueHubProxy(url, $rootScope, $sessionStorage);
            this.queue.client.onRegisterComplete = (sessionId, n) => {
               
                console.info('Waiting count: ' + n);
                console.info('SessionId: ' + sessionId)
            
                $sessionStorage.sessionId = sessionId;

                // Open modal
                var options: ng.ui.bootstrap.IModalSettings = {
                    templateUrl: 'Views/Modals/WaitingModal.html'//,
                    , controller: Application.Controllers.WaitingModalController
                    , controllerAs: 'modal'
                    , resolve: {
                        numberInLine: () => n // <- this will pass the same instance 
                        // of the item displayed in the table to the modal
                    }
                    , size: 'lg'
                };
                this.modalInstance = this.$modal.open(options);
                //this.$modal.open(options).result
                //    .then(() => console.info('then'));
            };


            this.queue.client.allowEntrance = () => {
                console.log('allow entrance');
                this.modalInstance.close();
                $location.path('/welcome')
            };


            this.queue.client.notifyClient = (n) => {
                console.info('NumberAhead: ' + n);
                $rootScope.$broadcast('number-ahead', { numberInLine: n })

            };


            $rootScope.$on('knock-allow', () => {
                console.info('allow knock')
             
            }
            );
            $rootScope.$on('knock-deny', () => {
                console.info('deny knock')
                $rootScope.$apply(function () {
                    $location.path('/index')
                    console.log($location.path());
                });
              
                console.info('deny knock')
            }
            );
        }

        public RegisterSession(email: string) {
            console.info('register session, email: '+email)
            this.$sessionStorage.email = email;
            this.queue.server.registerSession(email);
            this.startHeartBeat();
        }

        private startHeartBeat() {
            var intervalFn = () => {
                this.queue.server.heartBeat();
            };
            this.$interval(intervalFn, 1000);
        }

        public knock() {
            this.queue.server.knock(this.$sessionStorage.sessionId);
        }

    }
}