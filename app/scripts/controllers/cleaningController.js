'use strict';

function CleaningCtrl($scope, $rootScope, $route, $routeParams, $http, $location) {
	function SelectKarangguniCtrl($scope, $rootScope, $route, $routeParams, $http, $location) {
		$scope.LoadKarangguniList = function() {
			$http({
				method: 'GET',
				withCredentials: true,
				url: '',
				params: {
				}
			}).success(function(data) {

			}).error(function(data) {

			});
		};

		$scope.PublishCleaningForm = function() {
			$http({
				method: 'GET',
				withCredentials: true,
				url: '',
				params: {
				}
			}).success(function(data) {

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
			$('#video').css("display", "none");
			$('#snap').css("display", "none");
		});
	};
	
	$scope.SelectKarangguni = function(){
		$location.url('/clean/2');
	};
	
	$scope.StartSnapping();
}



