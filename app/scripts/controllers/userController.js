'use strict';

function UserProfileCtrl($scope, $rootScope, $filter, $http, $location, $log, $route, $routeParams, $timeout) {

  $scope.user_profile = {};
  $scope.user_profile._loading = true;

  $scope.GetUserProfile = function() {
    $http({
      method: 'JSONP',
      url: $rootScope._app.url.api + 'user/',
      params: {
        callback: 'JSON_CALLBACK',
        user_id: $routeParams.user_id
      }
    }).success(function(data, status) {
      $scope.user_profile = data;
      //$scope.user_profile._loading = false;
    }).error(function(data, status, headers, config) {
      //$scope.user_profile._loading = false;
      //$scope.user_profile._error = true;
    });
  };

  /* ---------------------------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------------------------
   */
  (function() {
    $scope.GetUserProfile();
  })();
}