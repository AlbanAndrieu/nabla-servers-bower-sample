'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:ContactsCtrl
 * @description
 * # ContactsCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('ContactsCtrl', function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'Bootstrap',
      'AngularJS',
      'Karma'
    ];
  });
