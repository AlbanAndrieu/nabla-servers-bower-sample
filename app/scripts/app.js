'use strict';

/**
 * @ngdoc overview
 * @name myTestApp
 * @description
 * # myTestApp
 *
 * Main module of the application.
 */
angular
  .module('myTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',// angular-translate
    'tmh.dynamicLocale',// angular-dynamic-locale
    //'bootstrap.navbar',
    'ui.bootstrap'
    //'nabla-header'
  ])
  .constant('DEBUG_MODE', /*DEBUG_MODE*/true/*DEBUG_MODE*/)
  .constant('VERSION_TAG', /*VERSION_TAG_START*/new Date().getTime()/*VERSION_TAG_END*/)
  .constant('LOCALES', {
    'locales': {
      'ru_RU': 'Русский',
      'en_US': 'English',
      'fr_FR': 'Francais'
    },
    'preferredLocale': 'en_US'
  })
  // Router
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
		navitem: true,
		name: 'route1',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
		navitem: true,
		name: 'route2',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/contacts', {
		navitem: true,
		name: 'route3',
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl'
      })
      .when('/test', {
        template: '<p>i am route 4 and not in the navbar</p>'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  // Angular debug info
  .config(function($compileProvider, DEBUG_MODE) {
    if (!DEBUG_MODE) {
      $compileProvider.debugInfoEnabled(false);// disables AngularJS debug info
    }
  })
  // Angular Translate
  .config(function($translateProvider, DEBUG_MODE, LOCALES) {
    if (DEBUG_MODE) {
      $translateProvider.useMissingTranslationHandlerLog();// warns about missing translates
    }

    //var translations = {
    //  HEADLINE: 'XSS possible!',
    //  PARAGRAPH: 'Hello {{username}}!',
    //};
    //$translateProvider.translations('en', translations);

    $translateProvider.useStaticFilesLoader({
      prefix: 'resources/locale-',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage(LOCALES.preferredLocale);
    //$translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

    // Enable sanitize of HTML
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  })
  // Angular Dynamic Locale
  .config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
  });

angular.module('myTestApp').controller('NavbarCtrl', function($scope, $sce, $translate) {
  $scope.logo = $sce.trustAsHtml('<svg class=\'icon icon-logo\' viewBox=\'0 0 24 32\'>' +
    '<use xlink:href=\'#icon-logo\'></use></svg>');

  $scope.searchInput = {placeholder: 'Search'};
  $scope.title = $translate('PROJECT_TITLE');

  $scope.selectOptions = [
    {value: 'choicevalue1', label: 'choicelabel1'},
    {value: 'choicevalue2', label: 'choicelabel2'}
  ];

  $scope.searchSelect = {
    'default': '{{"views.index.Search" | translate}}',
    'options': $scope.selectOptions
  };

  var submit = function() {
    $scope.submittedValue = $scope.searchInput.value;
  };

  $scope.searchButton = {
    'placeholder': '{{"views.index.Search" | translate}}',
    'submit': submit
  };

});
