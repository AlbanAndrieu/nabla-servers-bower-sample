'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('AboutCtrl', function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
