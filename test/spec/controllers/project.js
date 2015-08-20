'use strict';

describe('Controller: ProjectController', function() {

  // load the controller's module
  beforeEach(module('myTestApp'));

  var ProjectController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectController = $controller('ProjectController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(4);
  });
});
