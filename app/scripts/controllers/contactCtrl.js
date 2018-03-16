'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:ContactController
 * @description
 * # ContactController
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('ContactController', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
    $scope.aaBirthday = '19810721T00:00:00';
  });
