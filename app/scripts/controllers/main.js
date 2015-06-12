'use strict';

/**
 * @ngdoc function
 * @name myTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myTestApp
 */
angular.module('myTestApp')
  .controller('MainCtrl', function($scope, $resource/*, Auth, NABLA_GLOBALS*/) {
    //NABLA_GLOBALS.isDev = true;
    //Auth.user.set({
    //  loginName: 'nabla',
    //  userName: 'nabla',
    //  userShortName: 'NABLA',
    //  credentials: 'microsoft'
    //});
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var Book = $resource('./rest/books/:isbn');
    $scope.books = Book.query();
  });
