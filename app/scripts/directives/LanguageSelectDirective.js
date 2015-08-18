/**
 * @ngdoc function
 * @name translateApp.directive:LanguageSelectDirective
 * @description
 * # LanguageSelectDirective
 * Directive to append language select and set its view and behavior
 */
angular.module('myTestApp')
  .directive('ngTranslateLanguageSelect', function(LocaleService) {
    'use strict';

    return {
      restrict: 'A',
      replace: true,
      template: '' +
        '<div class="language-select" ng-if="visible">' +
          '<label>' +
            '{{"directives.language-select.Language" | translate}}:' +
            '<select ng-model="currentLocaleDisplayName"' +
              'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"' +
              'ng-change="changeLanguage(currentLocaleDisplayName)">' +
            '</select>' +
          '</label>' +
        '</div>' +
      '',
      controller: function($scope) {
        $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
        $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
        $scope.visible = $scope.localesDisplayNames &&
        $scope.localesDisplayNames.length > 1;

        $scope.changeLanguage = function(locale) {
          LocaleService.setLocaleByDisplayName(locale);
        };
      }
    };
  });

angular.module('myTestApp').controller('DropdownCtrl', function($scope, $log, LocaleService) {
  'use strict';
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

$scope.items = LocaleService.getLocaleDisplayName();

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
});
