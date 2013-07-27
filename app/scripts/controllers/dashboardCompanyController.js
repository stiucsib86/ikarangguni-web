'use strict';

function DashboardCompanyNotificationCtrl($http, $location, $rootScope, $scope, $routeParams) {

  var geocoder, map;

  $scope.GetNotification = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
        notification_id: $routeParams.notification_id
      }
    }).success(function(data, status, headers, config) {



      $scope.notification = {
        photo: 'http://www.zerowastesg.com/wp-content/uploads/2009/02/recycling-bins-3.jpg',
        location: 'Singapore 550425',
        sender: {
          name: 'Goh Bing Han',
          email: 'stiucsib86@hotmail.com'
        }
      };


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
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {

      $scope.notifications = [
        {
          notification_id: 1,
          photo: 'http://www.zerowastesg.com/wp-content/uploads/2009/02/recycling-bins-3.jpg',
          location: 'Singapore 550425',
          sender: {
            name: 'Goh Bing Han',
            email: 'stiucsib86@hotmail.com'
          }
        }, {
          notification_id: 2,
          photo: 'http://www.zerowastesg.com/wp-content/uploads/2009/02/recycling-bins-3.jpg',
          location: 'Singapore 550425',
          sender: {
            name: 'Goh Bing Han',
            email: 'stiucsib86@hotmail.com'
          }
        }
      ];

    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  (function() {
    $scope.GetNotifications();
  })();

}

function DashboardCompanySettingsCtrl($http, $location, $rootScope, $scope) {

  $scope.GetCompanySettings = function() {
    $scope.settings = {
      locations: [
        {
          postal: 139951
        },
        {
          postal: 550425
        }
      ]
    };
  };

  $scope.AddSettingsLocation = function() {
    ($scope.settings) || ($scope.settings = {});
    ($scope.settings.locations) || ($scope.settings.locations = []);

    $scope.settings.locations.push({});

  };

  $scope.DeleteSettingsLocation = function() {
    if (!$scope.settings || !$scope.settings.locations) {
      return;
    }
    $scope.settings.locations.splice(this.$index, 1);
  };

  (function() {
    $scope.GetCompanySettings();
  })();

}