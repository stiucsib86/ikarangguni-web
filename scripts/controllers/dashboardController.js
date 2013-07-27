'use strict';

function DashboardProfileCtrl($http, $location, $rootScope, $scope) {

  $scope.datepicker = {date: new Date("2012-09-01T00:00:00.000Z")};

  $scope.GetProfileSettings = function() {
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'user/',
      params: {
        //callback: 'JSON_CALLBACK'
      }
    }).success(function(data, status, headers, config) {
      $rootScope.auth = data;
    }).error(function(data, status, headers, config) {
      console.warn(data);
    });
  };

  (function() {
    $scope.GetProfileSettings();
  })();

}

function DashboardVerificationCtrl($location, $rootScope, $scope) {

}

function DashboardPayoutsCtrl($location, $rootScope, $scope) {

}

function DashboardCalendarCtrl($filter, $http, $location, $rootScope, $scope) {

  $scope.cal_settings = {
    currency: 'USD'
  };

  /* event source that calls a function on every view switch */
  $scope.eventsF = function(start, end, callback) {

    var s = new Date(start).getTime() / 1000;
    var e = new Date(end).getTime() / 1000;
    var m = new Date(start).getMonth();

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    console.log('start',start.toString());
    
    $http({
      method: 'GET',
      withCredentials: true,
      url: $rootScope._app.url.api + 'maid/calendar',
      params: {
        'start_date_min': start.toLocaleString(),
        'start_date_max' : end.toLocaleString(),
        'single_events': true,
      }
    }).success(function(xhrResponse) {
      console.log('xhrResponse', xhrResponse);
    });

    var events = [
      {id: 999, title: 'Available', start: s + (50000), allDay: false, className: ['available']},
      {id: 999, title: 'Available', start: new Date(y, m, 1), allDay: false, className: ['available']},
      {id: 999, title: 'Available', start: new Date(y, m, d - 5), allDay: false, className: ['available']},
      {id: 999, title: 'Not Available', start: new Date(y, m, d - 3, 16, 0), allDay: false, className: ['not-available']},
      {id: 999, title: 'Not Available', start: new Date(y, m, d + 4, 16, 0), allDay: false, className: ['not-available']},
      {id: 999, title: 'Not Available', start: new Date(y, m, d + 1, 19, 0), allDay: false, className: ['not-available']},
      {id: 999, title: 'Not Available', start: new Date(y, m, 28), allDay: false, className: ['not-available']}
    ];

    callback(events);
  };

  /* 
   * Calendar Events
   */

  ($scope.calendarEventModal) || ($scope.calendarEventModal = {});

  $scope.calendar_event_clear = function() {
    ($scope.calendar_event) || ($scope.calendar_event = {});

    $scope.calendar_event.timeslots = [];
    $scope.calendar_event.selectedTimeslot = function() {
      return $filter('filter')($scope.calendar_event.timeslots, {checked: true});
    };
    angular.forEach($rootScope.const.timeslots, function(value, key) {
      var _timeslot = {
        value: value,
        checked: false
      };
      $scope.calendar_event.timeslots.push(_timeslot);
    });

    ($scope.calendar_event.availability) || ($scope.calendar_event.availability = 1);

  };

  $scope.calendar_event_clear();

  $scope.calendar_day_select = function(startDate, endDate, allDay, jsEvent, view) {

    $scope.calendar_event_clear();

    console.log('startDate', startDate);

    angular.extend($scope.calendar_event, {
      start: startDate,
      end: endDate
    });

    $scope.calendarEventModal.title = '';

    $scope.$apply();
    $('#calendarEventModal').modal('show');

  };

  $scope.calendar_event_select = function(event, jsEvent, view) {

    $scope.calendarEventModal.title = 'Edit';

    $scope.$apply();
    $('#calendarEventModal').modal('show');

  };

  /* add and removes an event source of choice */
  $scope.addRemoveEventSource = function(sources, source) {
    var canAdd = 0;
    angular.forEach(sources, function(value, key) {
      if (sources[key] === source) {
        sources.splice(key, 1);
        canAdd = 1;
      }
    });
    if (canAdd === 0) {
      sources.push(source);
    }
  };
  /* add custom event*/
  $scope.addEvent = function() {
    $scope.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    });
  };
  /* remove event */
  $scope.remove = function(index) {
    $scope.events.splice(index, 1);
  };
  /* Change View */
  $scope.changeView = function(view, calendar) {
    calendar.fullCalendar('changeView', view);
  };
  /* config object */
  $scope.uiConfig = {
    calendar: {
      height: 500,
      header: {
        left: '',
        center: 'prev, today, next',
        right: 'month,agendaWeek,agendaDay'
      },
      selectable: true,
      selectHelper: true,
      select: $scope.calendar_day_select,
      eventClick: $scope.calendar_event_select,
      viewDisplay: $scope.viewDisplay
    }
  };

  $scope.viewDisplay = function(view) {
    console.log(view);
  };

  /* event sources array*/
  $scope.eventSources = [$scope.eventsF];




}

function DashboardMediaCtrl($location, $rootScope, $scope) {

}

function DashboardReviewsCtrl($location, $rootScope, $scope) {

}

function DashboardSettingsCtrl($location, $rootScope, $scope) {

}