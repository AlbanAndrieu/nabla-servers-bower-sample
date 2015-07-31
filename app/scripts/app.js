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
    'tmh.dynamicLocale'// angular-dynamic-locale
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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl'
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
