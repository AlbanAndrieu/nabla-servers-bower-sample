"use strict";

/**
 * @ngdoc function
 * @name myTestApp.controller:MainController
 * @description
 * # MainController
 * Controller of the myTestApp
 */
angular
  .module("myTestApp")
  .controller("MainController", function(
    $scope /*, $resource/*, Auth, NABLA_GLOBALS*/
  ) {
    //NABLA_GLOBALS.isDev = true;
    //Auth.user.set({
    //  loginName: 'nabla',
    //  userName: 'nabla',
    //  userShortName: 'NABLA',
    //  credentials: 'microsoft'
    //});
    $scope.awesomeThings = [
      "HTML5 Boilerplate",
      "Bootstrap",
      "AngularJS",
      "Karma",
    ];
    //var Book = $resource('./rest/books/:isbn');
    //$scope.books = Book.query();
  });
