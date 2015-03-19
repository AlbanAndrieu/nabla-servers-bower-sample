'use strict';

/**
 * @ngdoc function
 * @name cmrTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cmrTestApp
 */
angular.module('cmrTestApp')
  .controller('AboutCtrl', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
