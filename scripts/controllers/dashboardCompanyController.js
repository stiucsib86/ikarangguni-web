'use strict';

function DashboardCompanyNotificationCtrl($http, $location, $rootScope, $scope) {

  $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};

  $scope.GetProfileSettings = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {
      $rootScope.auth = data;
    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  (function() {
    $scope.GetProfileSettings();
  })();

}

function DashboardCompanyNotificationsCtrl($http, $location, $rootScope, $scope) {

  $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};

  $scope.GetProfileSettings = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {
      $rootScope.auth = data;
    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  (function() {
    $scope.GetProfileSettings();
  })();

}

function DashboardCompanySettingsCtrl($http, $location, $rootScope, $scope) {


  (function() {
  })();

}