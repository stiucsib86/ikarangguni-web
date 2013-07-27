'use strict';

var app_provider = angular.module('FacebookProvider', []);

app_provider.factory('Facebook', function($rootScope) {

	var _config = {};
	_config.permissions = 'read_stream, publish_stream, email';
	_config.channelUrl = '/channel.html';
	_config.status = true; // check login status
	_config.cookie = true; // enable cookies to allow the server to access the session
	_config.xfbml = true;  // parse XFBML

	return {
		init: function(FBConfig) {
			angular.extend(_config, FBConfig);

			window.fbAsyncInit = function() {
				FB.init({
					appId: _config.appId, // App ID
					channelUrl: _config.channelUrl, // Channel File
					status: _config.status, // check login status
					cookie: _config.cookie, // enable cookies to allow the server to access the session
					xfbml: _config.xfbml  // parse XFBML
				});
			};

			// Load the SDK asynchronously
			(function(d) {
				var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement('script');
				js.id = id;
				js.async = true;
				js.src = "//connect.facebook.net/en_US/all.js";
				ref.parentNode.insertBefore(js, ref);
			}(document));
		},
		getLoginStatus: function() {
			FB.getLoginStatus(function(response) {
				$rootScope.$broadcast("event.fb.auth.statusChange", {'status': response.status});
			}, true);
		},
		login: function() {
			FB.getLoginStatus(function(response) {
				switch (response.status) {
					case 'connected':
						$rootScope.$broadcast('event.fb.auth.login', {authResponse: response.authResponse});
						break;
					case 'not_authorized' || 'unknown':
						// 'not_authorized' || 'unknown': doesn't seem to work
						FB.login(function(response) {
							if (response.authResponse) {
								$rootScope.$broadcast('event.fb.auth.login', {
									facebook_id: response.authResponse.userID,
									userNotAuthorized: true
								});
							} else {
								$rootScope.$broadcast('event.fb.auth.login.failed');
							}
						}, {scope: _config.permissions});
						break;
					default:
						FB.login(function(response) {
							if (response.authResponse) {
								$rootScope.$broadcast('event.fb.auth.login', {facebook_id: response.authResponse.userID});
								$rootScope.$broadcast('event.fb.auth.authResponseChange');
							} else {
								$rootScope.$broadcast('event.fb.auth.login.failed');
							}
						});
						break;
				}
			}, true);
		},
		logout: function() {
			FB.logout(function(response) {
				if (response) {
					$rootScope.$broadcast('event.fb.auth.logout');
				} else {
					$rootScope.$broadcast('event.fb.auth.logout.failed');
				}
			});
		},
		unsubscribe: function() {
			FB.api("/me/permissions", "DELETE", function(response) {
				$rootScope.$broadcast('event.fb.auth.authResponseChange');
			});
		}
	};
});