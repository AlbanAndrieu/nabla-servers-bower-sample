'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:BlogCtrl
 * @description
 * # BlogCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('BlogCtrl', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
