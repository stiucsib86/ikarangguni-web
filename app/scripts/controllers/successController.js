'use strict';

function SuccessCtrl($scope, $rootScope, $route, $routeParams, $http, $location, $timeout) {

	$scope.returnToHome = function() {
		window.location.hash = '#/';
	};
}

