'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:AboutController
 * @description
 * # AboutController
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('AboutController', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];

  });
