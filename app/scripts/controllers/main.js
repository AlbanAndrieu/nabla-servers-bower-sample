'use strict';

/**
 * @ngdoc function
 * @name cmrTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cmrTestApp
 */
angular.module('cmrTestApp')
  .controller('MainCtrl', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
