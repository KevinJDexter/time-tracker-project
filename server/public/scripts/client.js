var app = angular.module('TaskTrackerApp', ['ngRoute, ngMaterial']);

app.config(['$routeProvider', function($routeProvider) {
  console.log('Route config loaded');
}])