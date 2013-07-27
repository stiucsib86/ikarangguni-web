'use strict';

function MaidProfileCtrl($scope, $rootScope, $filter, $http, $location, $log, $route, $routeParams, $timeout) {

  $scope.maid_profile = {};
  $scope.maid_profile._loading = true;

  $scope.GetMaidProfile = function() {
    $http({
      method: 'JSONP',
      url: $rootScope._app.url.api + 'maid/?callback=JSON_CALLBACK',
      params: {
        user_id: $routeParams.maid_id
      }
    }).success(function(data, status) {
      $scope.maid_profile = data.data;
      $scope.maid_profile._loading = false;
    }).error(function(data, status, headers, config) {
      $scope.maid_profile._loading = false;
      $scope.maid_profile._error = true;
    });
  };

  /* ---------------------------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------------------------
   */
  (function() {
    $scope.GetMaidProfile();
  })();
}