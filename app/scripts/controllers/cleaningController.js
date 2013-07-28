'use strict';

function CleaningCtrl($scope, $rootScope, $route, $routeParams, $http, $location, $timeout) {
	$scope.routeParams = $routeParams;
	$scope.gmaps = {};
	$scope.geocoder = new google.maps.Geocoder();
	$scope.showKGTable = false;
	$scope.photoTaken = false;
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
				latitude: $scope.gmaps.center.latitude,
				longitude: $scope.gmaps.center.longitude
			}
		}).success(function(data) {
			$scope.karungguniList = data;
			$scope.showKGTable = true;
		}).error(function(data) {
		});
	};

	$scope.StartSnapping = function() {
		$scope.photoTaken = false;
		var localStream;
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
				localStream = stream;
				video.play();
			}, errBack);
		} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
			navigator.webkitGetUserMedia(videoObj, function(stream) {
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
				localStream = stream;
			}, errBack);
		}

		// Trigger photo take
		document.getElementById("snap").addEventListener("click", function() {
			context.drawImage(video, 0, 0, 150, 150);
			video.pause();
			localStream.stop();
			video.src = "";
			$scope.photoTaken = true;
			$scope.$apply();
		});
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
			alert("Please Input a postal Code");
		}
	};

	$scope.SubmitItem = function() {
		var itemPic = document.getElementById("canvas");
		var image = new Image();
		image.src = itemPic.toDataURL("image/jpeg", 0.5);
		var userPostalCode = $('#postalCode').val();
		var userUnitNo = $('#unitNo').val();
		var selectedKarungguniId = $('#selectedKarungguni:checked').val();
		var itemType = $('#itemType').val();
		
		if(!image.src) {
			alert("Please snap a photo");
			return;
		}
		if(!userPostalCode){
			alert("Please input a postal code");
			return;
		}
		if(!userUnitNo){
			alert("Please input an unit number");
			return;
		}
		if(!selectedKarungguniId){
			alert("Please select a KarungGuni");
			return;
		}
		if(!itemType){
			alert("Please input an item type");
			return;
		}
		

		$timeout(function() {
			var formData = {
				photo: image.src,
				postal_code: userPostalCode,
				unit_no: userUnitNo,
				receiver_id: selectedKarungguniId,
				latitude: $scope.gmaps.center.latitude,
				longitude: $scope.gmaps.center.longitude,
				item_type: itemType
			};
			$http({
				method: 'POST',
				withCredentials: true,
				url: $rootScope._app.url.api + 'notification/?callback=JSON_CALLBACK',
				data: formData
			}).success(function(data) {
				window.location.hash = '#/recycle/success';
			}).error(function(data) {
				console.log(data);
			});
		}, 5000);

		//saveImgBase64(imgData);
	};

	$scope.filterKG = function() {
		var userPostalCode = $('#postalCode').val();
		$scope.getAddressGeocode(userPostalCode);
	};


	$scope.StartSnapping();
}