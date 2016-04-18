module Application.Controllers {

    //import Services = Application.Services;

    export class WaitingModalController {
        constructor(numberInLine: Number, public $rootScope: ng.IRootScopeService, public $scope: IWaitingModalScope) {
            $scope.NumberAhead =  numberInLine;
            $rootScope.$on('number-ahead', function (event, args) {

                $scope.NumberAhead = args.numberInLine;
                console.info('numberahead updated: ' + $scope.NumberAhead)
                //$scope.$apply();
            });


        }
    }
}