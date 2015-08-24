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
          //'<label>' +
            //'<a ng-click="scrollTo(\'top\')" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> {{"views.index.Language" | translate}} <span class="caret"></span></a>' +
            //'<a ng-click="scrollTo(\'top\')" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> </a>' +
            //'<span class="glyphicon glyphicon-globe" aria-hidden="true"></span> ' +
            //'{{"directives.language-select.Language" | translate}}:' +
            '<select class="form-control" ng-model="currentLocaleDisplayName"' +
              'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"' +
              'ng-change="changeLanguage(currentLocaleDisplayName)">' +
            '</select>' +

            //'</div>' +
          //'</label>' +
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
