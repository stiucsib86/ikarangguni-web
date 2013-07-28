'use strict';

function DashboardCompanyNotificationCtrl($http, $location, $rootScope, $scope, $routeParams) {

  var geocoder, map;

  $scope.GetNotification = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'notification/',
      params: {
        //callback: 'JSON_CALLBACK'
        id: $routeParams.notification_id
      }
    }).success(function(data, status, headers, config) {

      $scope.notification = data.data;

    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  $scope.UpdateStatusNotification = function() {
    $http({
      method: 'POST',
      withCredentials: true,
      url: $rootScope._app.url.api + 'notification/update/',
      params: {
        //callback: 'JSON_CALLBACK'
        id: $routeParams.notification_id,
        status: 1
      }
    }).success(function(data, status, headers, config) {

      //$scope.notification = data.data;
      location.reload();

    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  $scope.UpdatePayoutNotification = function() {
    $http({
      method: 'POST',
      withCredentials: true,
      url: $rootScope._app.url.api + 'notification/update/',
      params: {
        //callback: 'JSON_CALLBACK'
        id: $routeParams.notification_id,
        status: 1,
        issued_amount: document.getElementById('issued_amount').value,
        remarks: document.getElementById('remarks').value
      }
    }).success(function(data, status, headers, config) {

      //$scope.notification = data.data;
      location.reload();

    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  $scope.initializeGmaps = function() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(1.3223472, 103.75788149999994);
    var mapOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };


  $scope.setGmapCenter = function(address) {
    if (address) {
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var location = results[0].geometry.location;
          var latlng = new google.maps.LatLng(location.lat(), location.lng());
          map.setCenter(latlng);
        } else {
          console.warn("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  };

  $scope.$watch('notification.location', function(newValue, oldValue) {
    $scope.setGmapCenter(newValue);
  });

  (function() {
    $scope.GetNotification();
    $scope.initializeGmaps();
  })();

}

function DashboardCompanyNotificationsCtrl($http, $location, $rootScope, $scope) {

  $scope.GetNotifications = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'notifications/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {

      $scope.notifications = data.data;

    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  (function() {
    $scope.GetNotifications();
  })();

}

function DashboardCompanySettingsCtrl($http, $location, $rootScope, $scope) {

  var geocoder = new google.maps.Geocoder();

  $scope.GetCompanySettings = function() {
    $http({
      method: 'JSONP',
      withCredentials: true,
      url: $rootScope._app.url.api + 'settings/',
      params: {
        callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status) {
      $scope.settings = data.data;
    }).error(function(data, status, headers, config) {
    });
  };

  $scope.AddSettingsLocation = function() {
    ($scope.settings) || ($scope.settings = {});
    ($scope.settings.locations) || ($scope.settings.locations = []);

    $http({
      method: 'POST',
      withCredentials: true,
      url: $rootScope._app.url.api + 'settings/location',
    }).success(function(data, status) {
      console.log('data', data);
      $scope.settings.locations.push(data.data);
    }).error(function(data, status, headers, config) {
    });

  };

  $scope.UpdateSettingsLocation = function() {
    ($scope.settings) || ($scope.settings = {});
    ($scope.settings.locations) || ($scope.settings.locations = []);

    var $_scope = this;

    geocoder.geocode({'address': 'Singapore ' + $_scope.l.postal_code}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var location = results[0].geometry.location;
        var latlng = new google.maps.LatLng(location.lat(), location.lng());

        $_scope.l.latitude = location.lat();
        $_scope.l.longitude = location.lng();

        console.log($_scope.l);

        $http({
          method: 'POST',
          withCredentials: true,
          url: $rootScope._app.url.api + 'settings/location',
          data: $_scope.l
        }).success(function(data, status) {
        }).error(function(data, status, headers, config) {
        });
      } else {
        console.warn("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  $scope.DeleteSettingsLocation = function() {
    if (!$scope.settings || !$scope.settings.locations) {
      return;
    }

    var $_scope = this;

    $http({
      method: 'POST',
      withCredentials: true,
      url: $rootScope._app.url.api + 'settings/remove_location',
      params: {
        callback: 'JSON_CALLBACK'
      },
      data: this.l
    }).success(function(data, status) {
      $scope.settings.locations.splice($_scope.$index, 1);
    }).error(function(data, status, headers, config) {
    });
  };

  (function() {
    $scope.GetCompanySettings();
  })();

}