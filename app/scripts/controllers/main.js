'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('MainCtrl', function($scope, $resource, Auth, RI_GLOBALS) {
    RI_GLOBALS.isDev = true;
    Auth.user.set({
      loginName: 'kgr',
      userName: 'kgr',
      userShortName: 'KGR',
      credentials: 'Kondor_123'
    });
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var Book = $resource('./rest/books/:isbn');
    $scope.books = Book.query();
  });
