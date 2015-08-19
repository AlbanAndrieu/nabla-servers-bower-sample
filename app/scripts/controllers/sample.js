'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:SampleCtrl
 * @description
 * # SampleCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('SampleCtrl', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
