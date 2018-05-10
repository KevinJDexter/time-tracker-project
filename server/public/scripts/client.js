var app = angular.module('TaskTrackerApp', ['ngRoute', 'ngMaterial']);

app.config(['$routeProvider', function($routeProvider) {
  console.log('Route config loaded');

  $routeProvider
    .when('/', {
      templateUrl: 'views/entries.html',
      controller: 'EntryController as vm'
    })
    .when('/projects', {
      templateUrl: 'views/projects.html',
      controller: 'ProjectController as vm'
    })
    .when('/reports', {
      templateUrl: 'views/reports.html',
      controller: 'ReportController as vm'
    })
    .otherwise({
      template: '<h2>404 Page not found</h2>'
    })
}])