'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:ProjectController
 * @description
 * # ProjectController
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('ProjectController', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
