'use strict';

function MainCtrl($scope, $rootScope, $route, $routeParams, $location) {
  // $rootScope.$route = $route;
  // $rootScope.$location = $location;
  // $rootScope.$routeParams = $routeParams;
}

function SearchCtrl($scope, $rootScope, $filter, $http, $location, $log, $route, $routeParams, $timeout) {

  $scope.routeParams = $routeParams;
  $rootScope.header.search_keywords = $routeParams.search_keywords;
  $scope.gmaps = {};
  $scope.geocoder = new google.maps.Geocoder();

  $scope.search = function() {
    $http({
      method: 'JSONP',
      url: $rootScope._app.url.api + 'search/?callback=JSON_CALLBACK',
      params: {
        search_filter: $rootScope._search_filter
      }
    }).success(function(data, status, headers, config) {
    }).error(function(data, status, headers, config) {
      console.warn(status);
    });
  };

  /*
   * Google Maps
   */

  google.maps.visualRefresh = true;

  angular.extend($scope.gmaps, {
    center: {
      latitude: -34.397, // initial map center latitude
      longitude: 150.644 // initial map center longitude
    },
    bounds: {
      northEast: {},
      southWest: {}
    },
    markers: [], // an array of markers,
    zoom: 12, // the zoom level
    clickedLocation: {
      latitude: null,
      longitude: null
    },
    draggable: true,
    eventsProperty: {
      click: function(mapModel, eventName, originalEventArgs) {
        // 'this' is the directive's scope
        $log.log("user defined event on map directive with scope", this);
        $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
      },
      dragend: function() {
        $scope.getMaidList();
      },
      bounds_changed: function(mapModel, eventName, originalEventArgs) {
      }
    }
  });

  $scope.geolocationAvailable = navigator.geolocation ? true : false;

  $scope.getAddressGeocode = function() {
    if ($rootScope.header.search_keywords) {
      $scope.geocoder.geocode({'address': $rootScope.header.search_keywords}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var location = results[0].geometry.location;
          $scope.gmaps.center.latitude = location.lat();
          $scope.gmaps.center.longitude = location.lng();
          $scope.$apply();
        } else {
          console.warn("Geocode was not successful for the following reason: " + status);
        }
      });
    } else {
      $scope.getUserCenterMap();
    }
  };

  $scope.getUserCenterMap = function() {
    if ($scope.locationAvailable) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.gmaps.center = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        $scope.$apply();
      }, function() {
      });
    }
  };

  $scope.getMergedDataUrl = function(pic_src, callback) {

    var frame_src = $rootScope._app.assets.gmaps_user_frame.data_uri;

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var frame = new Image();
    var pic = new Image();
    var dataURL;

    canvas.width = $rootScope._app.assets.gmaps_user_frame.width;
    canvas.height = $rootScope._app.assets.gmaps_user_frame.height;

    pic.onload = function() {
      // Copy the image contents to the canvas
      ctx.drawImage(pic, 4, 4, 36, 36);

      frame.onload = function() {
        // Copy the image contents to the canvas
        ctx.drawImage(frame, 0, 0);

        if (typeof callback === 'function') {

          // Get the data-URL formatted image
          dataURL = canvas.toDataURL("image/png");

          callback(dataURL);
        }

      };
      frame.src = frame_src;

    };

    pic.src = pic_src;

  };

  $scope.maid_list = $scope.maid_list || {};
  jQuery.extend(true, $scope.maid_list, {
    _pagination: {
      no_of_pages: 20,
      max_size: 5,
      current_page: 1
    }
  });

  $scope.getMaidList = function() {

    $scope.maid_list._loading = true;

    var filters = jQuery.extend({}, $rootScope._search_filter, {
      center: $scope.gmaps.center,
      bounds: $scope.gmaps.bounds,
      current_page: $scope.maid_list._pagination.current_page
    });

    $http({
      method: 'JSONP',
      url: $rootScope._app.url.api + 'maids/',
      params: {
        callback: 'JSON_CALLBACK',
        filters: filters
      }
    }).success(function(data, status, headers, config) {

      jQuery.extend(true, $scope.maid_list, {
        data: [],
        _loading: false,
        _pagination: data.pagination
      });

      $scope.maid_list.data = data.data;

      $scope.gmaps.markers = [];

      /* Google Maps Binding */
      angular.forEach($scope.maid_list.data, function(maid, key) {

        $scope.getMergedDataUrl(maid.profile_image.thumb.data_uri, function(icon_dataUri) {

          var pinIcon = new google.maps.MarkerImage(
                  icon_dataUri,
                  null, /* size is determined at runtime */
                  null, /* origin is 0,0 */
                  null, /* anchor is bottom center of the scaled image */
                  new google.maps.Size(44, 55)
                  );

          $scope.addToGmapsMarker({
            latitude: maid.location.latitude,
            longitude: maid.location.longitude,
            label: maid.location.display_name,
            icon: pinIcon,
            draggable: false,
            infoWindowContent: 'infoWindowContent',
            url: 'http://www.google.com/',
            thumbnail: 'http://www.google.com/mapfiles/shadow50.png',
            shadow: pinIcon
          });
        });
      });

    }).error(function(data, status, headers, config) {
      console.warn(status);
    });
  };

  $scope.addToGmapsMarker = function(marker) {
    $scope.gmaps.markers.push(marker);
    // Refresh map
    $timeout(function() {
      $scope.gmaps.isMapElementHidden = false;
      $scope.gmaps.isMapElementHidden = false;
    }, 0);
  };

  /*
   * Initializations
   */

  (function() {
    $scope.getAddressGeocode();
    $timeout(function() {
      jQuery("#slider-range").slider($rootScope._page.search_filters.base_rate);
    }, 500);
  })();

  /*
   * Watch Events
   */

  $scope.$watch('maid_list._pagination.current_page', function() {
    if (typeof $scope.maid_list === 'undefined') {
      return;
    } else if (typeof $scope.maid_list._pagination === 'undefined') {
      return;
    } else {
      console.log('Current_page: ', $scope.maid_list._pagination.current_page);
      $scope.getMaidList();
    }
  });

  $scope.$watch('_search_filter', function() {
    $timeout(function() {
      $scope.maid_list._pagination.current_page = 1;
      $scope.getMaidList();
    }, 500);
  }, true);

  $scope.$watch('_page.search_filters.services', function() {
    $rootScope._search_filter.services = [];
    angular.forEach($rootScope._page.search_filters.services, function(service, key) {
      if (service.checked === true) {
        $rootScope._search_filter.services.push(service.service_name);
      }
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });
  }, true);

  $scope.$watch('_page.search_filters.country_of_origin_list', function() {
    $rootScope._search_filter.countries_of_origins = [];
    angular.forEach($rootScope._page.search_filters.country_of_origin_list, function(country, key) {
      if (country.checked === true) {
        $rootScope._search_filter.countries_of_origins.push(country.country_name);
      }
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    });
  }, true);

}

function footerCtrl($cookies, $scope, $rootScope) {

  $scope.$watch('global_currency', function(newValue) {
    if (newValue) {
      $cookies.global_currency = newValue;
      console.log('Currency changed to: ', $cookies.global_currency);
    }
  });

  $rootScope.global_currency = $cookies.global_currency;
  if (!$rootScope.global_currency) {
    $rootScope.global_currency = 'USD';
  }

  $rootScope.const.locale_list = [{
      value: 'en_US',
      label: 'English'
    }, {
      value: 'zh-CN',
      label: 'Chinese'
    }, {
      value: 'ms-MY',
      label: 'Bahasa Melayu'
    }];

  $scope.$watch('global_locale', function(newValue) {
    if (newValue) {
      $cookies.global_locale = newValue;
      console.log('Locale changed to: ', $cookies.global_locale);
    }
  });

  $rootScope.global_locale = $cookies.global_locale;
  if (!$rootScope.global_locale) {
    $rootScope.global_locale = 'en_US';
  }

}