'use strict';

function CleaningCtrl($scope, $rootScope, $route, $routeParams, $http, $location) {
  $scope.routeParams = $routeParams;
  $scope.gmaps = {};
  $scope.geocoder = new google.maps.Geocoder();
  $scope.showKGTable = false;
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

	$scope.LoadKarangguniList = function() {
		$http({
			method: 'GET',
			withCredentials: true,
			url: 'http://ikarangguni-api.ap01.aws.af.cm/company', 
			params: {
			latitude:$scope.gmaps.center.latitude,
			longitude:$scope.gmaps.center.longitude
			}
		}).success(function(data) {
			$scope.karungguniList = data;
			$scope.showKGTable = true;
		}).error(function(data) {
			
		});
	};

			}).error(function(data) {
				console.warn(data);
			});
		};
	}

	$scope.StartSnapping = function() {

		// Grab elements, create settings, etc.
		var canvas = document.getElementById("canvas"),
				context = canvas.getContext("2d"),
				video = document.getElementById("video"),
				videoObj = {"video": true},
		errBack = function(error) {
			console.log("Video capture error: ", error.code);
		};

		// Put video listeners into place
		if (navigator.getUserMedia) { // Standard
			navigator.getUserMedia(videoObj, function(stream) {
				video.src = stream;
				video.play();
			}, errBack);
		} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia(videoObj, function(stream) {
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
			}, errBack);
		}
		
		// Trigger photo take
		document.getElementById("snap").addEventListener("click", function() {
			context.drawImage(video, 0, 0, 150, 150);
			video.pause();
			video.src = null;
			$('#video').css("display", "none");
			$('#snap').css("display", "none");
		});
	};

	$scope.SelectKarangguni = function(){
		$location.url('/clean/2');
	};

  $scope.getAddressGeocode = function(postalCode) {
    var locationZip = postalCode;
	if (locationZip) {
	    $scope.geocoder.geocode({'address': 'Singapore ' + locationZip}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var location = results[0].geometry.location;
          $scope.gmaps.center.latitude = location.lat();
          $scope.gmaps.center.longitude = location.lng();
          $scope.$apply();
		  $scope.LoadKarangguniList();
        } else {
          console.warn("Geocode was not successful for the following reason: " + status);
        }
      });
    } else {
      $scope.getUserCenterMap();
    }
  };
function HistoryCtrl($http, $location, $rootScope, $scope) {

  $scope.getUserCenterMap = function() {
    if ($scope.geolocationAvailable) {
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
  $scope.GetHistory = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {

	$scope.SubmitItem = function(){
		var itemPic = document.getElementById("canvas");
		var imgData = itemPic.toDataURL();
		var userPostalCode = $('#postalCode').val();
		var userUnitNo = $('#unitNo').val();
		var selectedKarungguniId = $('#selectedKarungguni:checked').val();
		var formData = {
			photo:imgData,
			postal_code:userPostalCode,
			unit_no:userUnitNo,
			receiver_id:selectedKarungguniId
		};
		$http({
			method: 'POST',
			url: $rootScope._app.url.api + 'notification/?callback=JSON_CALLBACK',
			data: formData
		}).success(function(data) {
			console.log("success",data);
		}).error(function(data){
			console.log(data);
		});
		//saveImgBase64(imgData);
	};
	
	$scope.filterKG = function(){
		var userPostalCode = $('#postalCode').val();
		 $scope.getAddressGeocode(userPostalCode);
	};
	
	$scope.StartSnapping();
}      $scope.history = [
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
    $scope.GetHistory();
  })();

}