'use strict';

describe('Controller: BlogController', function() {

  // load the controller's module
  beforeEach(module('myTestApp'));

  var BlogController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    BlogController = $controller('BlogController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(4);
  });
});
