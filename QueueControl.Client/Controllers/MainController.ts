module Application.Controllers {
    export class MainController {
        constructor(private $scope: ng.IScope
            , private $communicationService: Application.Services.CommunicationService) {
            console.info('Main controller ctor')
            $scope.$on('$locationChangeStart', function (event) {
                // Check if entrance is allowed.
                console.info('locchangestart')
                $communicationService.knock();
            });
        }
    }
}