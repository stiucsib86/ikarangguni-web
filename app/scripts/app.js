'use strict';

angular.module('ikarangguniWebApp', ['ngCookies', 'FacebookProvider', 'google-maps', 'ui.bootstrap', 'ui.calendar', '$strap.directives'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/v1/home/main.html',
    controller: 'MainCtrl'
  })
  .when('/login', {
    templateUrl: 'views/v1/home/login.html',
    controller: 'LoginCtrl'
  })
  .when('/logout', {
    templateUrl: 'views/v1/home/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/register', {
    templateUrl: 'views/v1/home/register.html',
    controller: 'RegisterCtrl'
  })
  .when('/search/:search_keywords', {
    templateUrl: 'views/v1/home/search.html',
    controller: 'SearchCtrl'
  })
  .when('/user/:user_id', {
    templateUrl: 'views/v1/user/profile.html',
    controller: 'UserProfileCtrl'
  })
  .when('/maid/:maid_id', {
    templateUrl: 'views/v1/maid/profile.html',
    controller: 'MaidProfileCtrl'
  })
  .when('/maid/book/:maid_id', {
    templateUrl: 'views/v1/maid/book.html',
    controller: 'MainCtrl'
  })
  .when('/recycle',{
	  templateUrl: 'views/v1/cleaning/cleaning.html',
	  controller: 'CleaningCtrl'
  })
  .when('/recycle/1',{
	  templateUrl: 'views/v1/cleaning/snap-trash.html',
	  controller: 'CleaningCtrl'
  })
  .when('/recycle/2',{
	  templateUrl: 'views/v1/cleaning/pick-karangguni.html',
	  controller: 'CleaningCtrl'
  })
  .when('/recycle/history',{
	  templateUrl: 'views/v1/cleaning/history.html',
	  controller: 'HistoryCtrl'
  })
.when('/recycle/success', {
		templateUrl: 'views/v1/cleaning/success.html',
		controller: 'SuccessCtrl'
	})
  .when('/recycle/history/:notification_id', {
    templateUrl: 'views/v1/cleaning/history-item.html',
    controller: 'DashboardCompanyNotificationCtrl'
  })

  /*
   * Permanent pages
   */
  .when('/p/cancellation_poicies', {
    templateUrl: 'views/v1/p/cancellation-policies.html',
    controller: 'MainCtrl'
  })
  /*
   * /dashboard/user
   */
  .when('/dashboard', {
    templateUrl: 'views/v1/dashboard/dashboard.html',
    controller: 'DashboardProfileCtrl'
  })
  .when('/dashboard/user', {
    templateUrl: 'views/v1/dashboard/dashboard.html',
    controller: 'DashboardProfileCtrl'
  })
  .when('/dashboard/user/profile', {
    templateUrl: 'views/v1/dashboard/user/profile.html',
    controller: 'DashboardProfileCtrl'
  })
  .when('/dashboard/user/verifications', {
    templateUrl: 'views/v1/dashboard/user/verifications.html',
    controller: 'DashboardVerificationCtrl'
  })
  .when('/dashboard/user/payouts', {
    templateUrl: 'views/v1/dashboard/user/payouts.html',
    controller: 'DashboardPayoutsCtrl'
  })
  .when('/dashboard/user/media', {
    templateUrl: 'views/v1/dashboard/user/media.html',
    controller: 'DashboardMediaCtrl'
  })
  .when('/dashboard/user/reviews', {
    templateUrl: 'views/v1/dashboard/user/reviews.html',
    controller: 'DashboardReviewsCtrl'
  })
  .when('/dashboard/user/settings', {
    templateUrl: 'views/v1/dashboard/user/settings.html',
    controller: 'DashboardSettingsCtrl'
  })
  .when('/dashboard/user/notifications', {
    templateUrl: 'views/v1/dashboard/user/notifications.html',
    controller: 'DashboardSettingsCtrl'
  })
  /*
   * /company/notification
   */
  .when('/dashboard/notifications', {
    templateUrl: 'views/v1/dashboard/company/notifications.html',
    controller: 'DashboardCompanyNotificationsCtrl'
  })
  .when('/dashboard/notifications/:notification_id', {
    templateUrl: 'views/v1/dashboard/company/notification.html',
    controller: 'DashboardCompanyNotificationCtrl'
  })
  .when('/dashboard/settings', {
    templateUrl: 'views/v1/dashboard/company/settings.html',
    controller: 'DashboardCompanySettingsCtrl'
  })
  /*
   * /dashboard/maid
   */
  .when('/dashboard/maid', {
    templateUrl: 'views/v1/dashboard/dashboard.html',
    controller: 'DashboardProfileCtrl'
  })
  .when('/dashboard/maid/advanced', {
    templateUrl: 'views/v1/dashboard/maid/advanced.html',
    controller: 'DashboardCalendarCtrl'
  })
  .when('/dashboard/maid/calendar', {
    templateUrl: 'views/v1/dashboard/maid/calendar.html',
    controller: 'DashboardCalendarCtrl'
  })
  .when('/dashboard/maid/contacts', {
    templateUrl: 'views/v1/dashboard/maid/contacts.html',
    controller: 'DashboardCalendarCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
