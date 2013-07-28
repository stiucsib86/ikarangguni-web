'use strict';

angular.module('ikarangguniWebApp')
		.directive('mainDirective', function() {
	return {
		template: '<div></div>',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			console.log("inside mainDirective, link function");

			element.text('this is the mainDirective directive');
		}
	};
}).directive('googlePlace', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			var options = {
				types: [],
				componentRestrictions: {country: 'in'}
			};
			scope.gPlace = new google.maps.places.Autocomplete(element[0]);
			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				model.$setViewValue(element.val());
				scope.$apply();
			});
		}
	};
}).directive('ngModelOnblur', function() {
	//from http://stackoverflow.com/questions/11868393/angularjs-inputtext-ngchange-fires-while-the-value-is-changing
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elm, attr, ngModelCtrl) {
			if (attr.type === 'radio' || attr.type === 'checkbox')
				return;

			elm.unbind('input').unbind('keydown').unbind('change');
			elm.bind('blur', function() {
				scope.$apply(function() {
					ngModelCtrl.$setViewValue(elm.val());
				});
			});
		}
	};
}).directive('ngBlur', function() {
	// from http://stackoverflow.com/questions/11380866/angularjs-how-to-force-an-input-to-be-re-rendered-on-blur
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function(scope, elm, attrs, ctrl) {
			elm.bind('blur', function() {
				var viewValue = ctrl.$modelValue;
				for (var i in ctrl.$formatters) {
					viewValue = ctrl.$formatters[i](viewValue);
				}
				ctrl.$viewValue = viewValue;
				ctrl.$render();
			});
		}
	};
}).directive("timeAgo", function($q) {
	return {
		restrict: 'A',
		scope: {
			title: '@'
		},
		link: function(scope, element, attrs) {

			// Using deferred to assert we only initialize timeago() once per
			// directive.
			var parsedDate = $q.defer();
			parsedDate.promise.then(function() {
				jQuery(element).timeago();
			});

			attrs.$observe('title', function(newValue) {
				if (newValue) {
					parsedDate.resolve(newValue);
				}
			});

		}
	};
}).directive("spinJs", function($q) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var inputOpts;

			var updateSpinJs = function() {

				var $elm = $(element);
				var _parent_height = $elm.parent().height();

				// Default values
				var opts = {
					lines: 12, // The number of lines to draw
					length: 7, // The length of each line
					width: 5, // The line thickness
					radius: 10, // The radius of the inner circle
					rotate: 0, // Rotation offset
					corners: 1, // Roundness (0..1)
					color: '#000', // #rgb or #rrggbb
					direction: 1, // 1: clockwise, -1: counterclockwise
					speed: 1, // Rounds per second
					trail: 100, // Afterglow percentage
					opacity: 1 / 4, // Opacity of the lines
					fps: 20, // Frames per second when using setTimeout()
					zIndex: 2e9, // Use a high z-index by default
					className: 'spinner', // CSS class to assign to the element
					top: 'auto', // center vertically
					left: 'auto', // center horizontally
					position: 'relative'  // element position
				};

				jQuery.extend(opts, inputOpts);

				if (attrs.color) {
					opts.color = attrs.color;
				}

				var spinner = new Spinner(opts).spin();
				$elm.html(spinner.el);
			};

			// watch the expression, and update the UI on change.
			scope.$watch(attrs.spinJs, function(value) {
				inputOpts = value;
				updateSpinJs();
			});

		}
	};
}).directive("linkSpy", function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var $elm = $(element);
			var $arr_a = $elm.find('a');

			angular.forEach($arr_a, function(value, key) {
				var $_elm_a = $(value);
				if ($(value).attr('href').indexOf(location.hash) === 0) {
					if (Math.abs($(value).attr('href').length - location.hash.length) < 2) {
						$_elm_a.parent().addClass('active');
					}
				}
			});
		}
	};
}).directive("breadCrumb", function($location) {
	return {
		restrict: 'A',
		template: '<ul class="breadcrumb">'
				+ '<li ng-repeat="l in location_arr" ng-class="{\'active\':l.active}">'
				+ '<a ng-hide="l.active" ng-href="{{l.hash}}" ng-bind-html-unsafe="l.label"></a> '
				+ '<span ng-show="l.active" ng-bind-html-unsafe="l.label"></span> '
				+ '<span ng-hide="l.active" class="divider">/</span></li>'
				+ '</ul>',
		link: function(scope, element, attrs) {

			var $elm = $(element);
			var _location_arr = $location.url().split('/');
			var _location_hash = '#/';

			scope.location_arr = [{
					label: '<i class="icon-home"></i> Home',
					hash: _location_hash
				}];

			angular.forEach(_location_arr, function(value, key) {
				if (value) {
					_location_hash += (value + '/');

					var breadcrumb_item = {
						label: value.charAt(0).toUpperCase() + value.slice(1),
						hash: _location_hash
					};

					if (key === (_location_arr.length - 1)) {
						breadcrumb_item.active = 1;
						delete breadcrumb_item.href;
					}

					scope.location_arr.push(breadcrumb_item);
				}
			});

		}
	};
}).directive("bTrans", function($http) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var $elm = $(element);
			var $text = $elm.html();
			var form_data = {
				client_id: 'CnA2P59x2DyIpozn3QFMzmp8',
					q: $text,
					from: 'auto',
					to: 'auto',
			};
			jQuery.getJSON(' http://openapi.baidu.com/public/2.0/bmt/translate?callback=?',form_data,function(data){
			console.log(data);	
			});
//			$http({
//				method: 'JSONP',
//				withCredentials: true,
//				url: ' http://openapi.baidu.com/public/2.0/bmt/translate?',
//				params: {
//					client_id: 'CnA2P59x2DyIpozn3QFMzmp',
//					q: $text,
//					from: 'auto',
//					to: 'auto',
//					callback: 'JSON_CALLBACK'
//				}
//			}).success(function(data) {
//				console.log(data);
//			});
		}
	};
});