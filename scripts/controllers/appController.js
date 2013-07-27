'use strict';

function AppCtrl($cookies, $scope, $rootScope, $route, $routeParams, $http, $location, $timeout, Facebook) {
  $rootScope.$route = $route;
  $rootScope.$location = $location;
  $rootScope.$routeParams = $routeParams;

  /*
   * Application Configs
   */

  jQuery.extend(true, $rootScope, {
    _app: {
      debug: true,
      title: 'iKarangGuni',
      page: {
        title: ' | Get your place cleaned.'
      }
    },
    _page: {
      search_filters: {
        base_rate: {
          range: true,
          min: 0,
          max: 100,
          values: [0, 100],
          slide: function(event, ui) {
            var min = ui.values[0];
            var max = ui.values[1];
            $rootScope._page.search_filters.base_rate.values = [min, max];
            jQuery.extend(true, $rootScope, {
              _search_filter: {
                base_rate_range: {
                  min: min,
                  max: max
                }
              }
            });
            $rootScope.$apply();
          }
        },
        country_of_origin_list: [{
            'country_name': 'Singapore'
          }, {
            'country_name': 'Malaysia'
          }, {
            'country_name': 'Indonesia'
          }, {
            'country_name': 'Thailand'
          }, {
            'country_name': 'Philippines'
          }, {
            'country_name': 'Vietname'
          }, {
            'country_name': 'United States'
          }]
      }
    },
    header: {}
  });

  /*
   * Search Filters
   */
  jQuery.extend(true, $rootScope, {
    _search_filter: {
      base_rate_range: {
        min: 0,
        max: 50
      },
      rating: {
        min: 1
      }
    }

  });

  /*
   * Application URLs
   */
  $rootScope._app.url = {};
  if (document.location.hostname.indexOf('localhost') !== -1) {
    // Localhost
    //$rootScope._app.url.api = '//ikarangguni.duapp.com/';
    $rootScope._app.url.api = '//ikarangguni-api.ap01.aws.af.cm/';
  } else {
    // Live Server
    $rootScope._app.url.api = '//ikarangguni-api.ap01.aws.af.cm/';
  }

  /*
   * Application Assets
   */
  $rootScope._app.assets = {};
  $rootScope._app.assets.gmaps_user_frame = {};
  $rootScope._app.assets.gmaps_user_frame.width = 44;
  $rootScope._app.assets.gmaps_user_frame.height = 55;
  $rootScope._app.assets.gmaps_user_frame.data_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAA3CAMAAABAS1hrAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sEHBIYEaxrxx4AAACuUExURf///wCa2wCa2wBzsABipABSlwBMkABEigAzgQA6ggA/hwA4gAA0hAAzggAzfgBZpgApcgAocQCQ2QAhYgCE0wB2zQBoyAA0gwAyggBbwwBOvgBEuwA8uACV2gCS2ACF1AB70ABzzQA0gwBrygBvywA3mQBjxwA0gwA8uABXwgBRkwA9twBMvgBEuwA7twA7tQA8twAxgwA7swBBugBGuwA3pQA/uAAlYgAZQQAcRh7GwyMAAAA6dFJOUwBdYnF4gIeLjJGRlpeboKOms7a7vsHExcbHy87P1tfa3d/g4eHi4+bm5+jp6uvs7u7v7+/v8fL19/fI0DxDAAAAAWJLR0QAiAUdSAAAAWVJREFUSMe10ItygjAQBdD0/VSr9l1boCCWCmwAWeT/f6zZJOg4U+umM9xRgXC8LBGieH7ayb7L8VCI5vuYl6PRpWhP3pmZ3Cr8wcxkoLFgxGLP42DPu1f4tD/s+xzs+074QeGzIODgIHDAkcFRxMLRo8LnYcjBYahxHHNwHBO+6AW/KHydJBycJISvXPBNL/hV4UGacnCaEh72hu+yjIOz7I3wygmvOHhlcFVxcFURHnPxjLBEDs5RY5QcDNI0s7C0zawxpG6e8jDq5qnLGFxsxpAuMzObwaEZ/vGCiJJifkEi0gKg1OvqoNbonPC6KJGuQK9aoL+W61P6z2wo1k29CVCzCZoHqE/Z3Z2PhWibTeoSzINRdlnWRXe32HmHtqkBts9Wyb/mi31vrEYq7YT6oOzn/v0hLc1mIEK+/Mtuu/VWHLBdNxycYaOBdjxfHra2W3J6O83rtTrnWtLFQrDTNr8u/wBP23BERECL5AAAAABJRU5ErkJggg==';


  /*
   * Facebook Initializations
   */
  if (typeof Facebook !== 'undefined') {
    Facebook.init({
      appId: '497232760353519', // App ID
      channelUrl: '/channel.html', // Channel File
      status: true, // check login status
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: true, // parse XFBML
      permissions: 'read_stream, publish_stream, email'
    });
  }

  $scope.fb_login = function() {
    Facebook.login();
  };

  /*
   * Constants
   */
  $rootScope.const = {
    gender: ['Male', 'Female'],
    currencies: [
      {
        "value": "BTC",
        "icon_label": "<i class=\"icon-btc\"></i>&nbsp;BTC"
      },
      {
        "value": "CNY",
        "icon_label": "<i class=\"icon-cny\"></i>&nbsp;CNY"
      },
      {
        "value": "EUR",
        "icon_label": "<i class=\"icon-eur\"></i>&nbsp;EUR"
      },
      {
        "value": "GBP",
        "icon_label": "<i class=\"icon-gbp\"></i>&nbsp;GBP"
      },
      {
        "value": "INR",
        "icon_label": "<i class=\"icon-inr\"></i>&nbsp;INR"
      },
      {
        "value": "JPY",
        "icon_label": "<i class=\"icon-jpy\"></i>&nbsp;JPY"
      },
      {
        "value": "KRW",
        "icon_label": "<i class=\"icon-krw\"></i>&nbsp;KRW"
      },
      {
        "value": "USD",
        "icon_label": "<i class=\"icon-usd\"></i>&nbsp;USD"
      }
    ],
    timeslots: [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ],
    availabilities: [
      {
        value: 1,
        label: 'Available'
      }, {
        value: 0,
        label: 'Not Available'
      }
    ],
    cancellation_policies: [
      {
        value: 1,
        label: 'Flexible: Full refund 1 day prior to arrival, except fees'
      }, {
        value: 2,
        label: 'Moderate: Full refund 5 days prior to arrival, except fees'
      }, {
        value: 3,
        label: 'Strict: 50% refund up until 1 week prior to arrival, except fees'
      }
    ]
  };

  /*
   * Scope Functions
   */
  $scope.header_search_form_submit = function(search_keyword) {
    $timeout(function() {
      $location.path('/search/' + $scope.header.search_keywords);
    }, 1000);
  };

  // Global Functions
  $rootScope.fn = {
    md5: md5,
    getGravatarUrl: function(email) {
      return '//www.gravatar.com/avatar/' + md5(email);
    }
  };

  /*
   * Watch Events
   */
  $scope.$watch('header.search_keywords', function() {
    console.log('Searching for: ' + $rootScope.header.search_keywords);
  });

  $scope.$watch('_page.search_filters.base_rate', function() {
    jQuery("#slider-range").slider($rootScope._page.search_filters.base_rate);
  }, true);

  (function() {
    /* -------------------------------------------------------------------------
     *  Initializations
     * -------------------------------------------------------------------------
     */
  })();

}
