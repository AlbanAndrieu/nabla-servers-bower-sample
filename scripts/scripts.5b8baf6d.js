/**
 * bower-sample
 * @version v1.0.1 - 2015-06-29
 * @link http://home.nabla.mobi
 * @author Alban Andrieu <alban.andrieu@hnabla.mobi>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

"use strict";angular.module("myTestApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("myTestApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","Bootstrap","AngularJS","Karma"]}]),angular.module("myTestApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","Bootstrap","AngularJS","Karma"]}]),console.log("'Allo 'Allo!");