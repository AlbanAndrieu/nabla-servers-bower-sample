'use strict';

describe('Controller: SampleController', function() {

  // load the controller's module
  beforeEach(module('myTestApp'));

  var SampleController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    SampleController = $controller('SampleController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(4);
  });
});
