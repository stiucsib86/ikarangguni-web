'use strict';

function AuthCtrl($scope, $rootScope, $route, $routeParams, $http, $location) {

  // Connect to backend for authentication
  $rootScope.get_auth_details = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'auth/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {
      $rootScope.auth = data;
    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  $scope.$watch('auth', function() {
    if ($rootScope.auth && $rootScope.auth.user) {
      //console.log("Welcome " + $rootScope.auth.user.name.display_name);
    }
  });

  (function() {
    /* -------------------------------------------------------------------------
     *  Initializations
     * -------------------------------------------------------------------------
     */
    $rootScope.get_auth_details();
  })();

}

function LoginCtrl($scope, $rootScope, $route, $routeParams, $location) {
  // $rootScope.$route = $route;
  // $rootScope.$location = $location;
  // $rootScope.$routeParams = $routeParams;

}

function LogoutCtrl($http, $scope, $rootScope, $route, $routeParams, $location) {
  // $rootScope.$route = $route;
  // $rootScope.$location = $location;
  // $rootScope.$routeParams = $routeParams;
  $http({
    method: 'POST',
    withCredentials: true,
    url: $rootScope._app.url.api + 'auth/logout'
  }).success(function(data, status, headers, config) {
    $rootScope.auth = {};
    window.location = '/';
  }).error(function(data, status, headers, config) {
  });

}

function FacebookCtrl($scope, $rootScope, $route, $routeParams, $http, $location) {

  $rootScope.$on('event.fb.auth.login', function(event, args) {
    var authResponse = args.authResponse;

    var $fbcbtn = $('.fb-connect.button');
    var $fbcbtn_scope = angular.element($fbcbtn).scope();

    if ($fbcbtn_scope.login_form) {
      $fbcbtn_scope.login_form.fbc_btn = $fbcbtn_scope.login_form.fbc_btn || {};
      $fbcbtn_scope.login_form.fbc_btn._loading = true;
      $fbcbtn_scope.$apply();
    }

    // Connect to backend for authentication
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'auth/',
      params: {
        //callback: 'JSON_CALLBACK',
        accessToken: authResponse.accessToken,
        type: 'Facebook',
        fb_userID: authResponse.userID
      }
    }).success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $rootScope.auth = data;
      window.location = '#/dashboard';
    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  });

}