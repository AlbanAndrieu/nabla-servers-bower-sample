'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:BlogController
 * @description
 * # BlogController
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('BlogController', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
