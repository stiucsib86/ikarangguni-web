'use strict';

angular.module('ikarangguniWebApp')
        .filter('mainFilter', function() {
  return function(input) {
    return 'mainFilter filter: ' + input;
  };
}).filter("timeAgo", function() {
  return function(date) {
    return jQuery.timeago(date);
  };
}).filter("baidutranslate", function($http) {
  return function(date) {
    return 'nothing yet...';
  };
});
