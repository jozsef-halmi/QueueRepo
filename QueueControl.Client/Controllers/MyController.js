var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        //import Services = Application.Services;
        var MyController = (function () {
            function MyController($scope) {
                this.scope = $scope;
                //this.myService = myService;
                this.data = [1, 2, 3, 4, 5];
            }
            MyController.prototype.DoSomething = function () {
                return 5;
            };
            return MyController;
        }());
        Controllers.MyController = MyController;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=mycontroller.js.map