'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('ProjectCtrl', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
