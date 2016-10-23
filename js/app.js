const app = angular.module("map", []);

app.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    };
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
});

app.controller("MainController", ['$scope','$http', function($scope,$http){
	
	$scope.address = {};
	$scope.items = [];
	$scope.loader = false;
	
	$scope.setPlace = function(obj){
		$scope.$apply(function(){
			$scope.address = obj;
			$scope.items = [];
		});
	};
	
	$scope.getMnimia = function(){
		$scope.loader = true;
		$http.post("service/get_mnimia.php", $scope.address)
		.success(function(data){
			$scope.items = data;
			console.log(data);
		})
		.finally(function(){
			$scope.loader = false;
		});
	};
	
}]);