'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:SampleController
 * @description
 * # SampleController
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('SampleController', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
