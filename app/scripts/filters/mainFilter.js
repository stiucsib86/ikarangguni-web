'use strict';

angular.module('getmaidappWebApp')
        .filter('mainFilter', function() {
  return function(input) {
    return 'mainFilter filter: ' + input;
  };
}).filter("timeAgo", function() {
  return function(date) {
    return jQuery.timeago(date);
  };
});
