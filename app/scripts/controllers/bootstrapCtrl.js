"use strict";

/**
 * @ngdoc function
 * @name myTestApp.controller:BootstrapController
 * @description
 * # BootstrapController
 * Controller of the myTestApp
 */
angular
  .module("myTestApp")
  .controller("BootstrapController", function($scope) {
    // Yeoman part (for tests)
    $scope.awesomeThings = [
      "HTML5 Boilerplate",
      "Bootstrap",
      "AngularJS",
      "Karma",
    ];
  });
