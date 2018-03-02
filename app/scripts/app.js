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
    'ui.gravatar',
    'ui.bootstrap'
    //'nabla-header'
  ])
  .constant('DEBUG_MODE', /*DEBUG_MODE*/true/*DEBUG_MODE*/)
  .constant('VERSION_TAG', /*VERSION_TAG_START*/new Date().getTime()/*VERSION_TAG_END*/)
  .constant('LOCALES', {
    'locales': {
      //'ru_RU': 'Русский',
      'en_US': 'English',
      'fr_FR': 'Francais',
      'no_NO': 'Norsk'
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
        controller: 'MainController'
      })
      .when('/about', {
		navitem: true,
		name: 'route2',
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .when('/blog', {
		navitem: true,
		name: 'route3',
        templateUrl: 'views/blog.html',
        controller: 'BlogController'
      })
      .when('/project', {
		navitem: true,
		name: 'route4',
        templateUrl: 'views/project.html',
        controller: 'ProjectController'
      })
      .when('/sample', {
		navitem: true,
		name: 'route5',
        templateUrl: 'views/sample.html',
        controller: 'SampleController'
      })
      .when('/yeoman', {
		navitem: true,
		name: 'route6',
        templateUrl: 'views/yeoman.html',
        controller: 'YeomanController'
      })
      .when('/boostrap', {
		navitem: true,
		name: 'route7',
        templateUrl: 'views/styles.html',
        controller: 'BootstrapController'
      })
      .when('/contacts', {
		navitem: true,
		name: 'route8',
        templateUrl: 'views/contact.html',
        controller: 'ContactController'
      })
      .when('/test', {
        template: '<p>i am route 4 and not in the navbar</p>'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  // Angular Reduce the number of $apply() calls
  .config(function($httpProvider) {
    $httpProvider.useApplyAsync(true);
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

    var translations = {
      HEADLINE: 'XSS possible!',
      PARAGRAPH: 'Hello {{username}}!'
    };
    $translateProvider.translations('en', translations);

    $translateProvider.useStaticFilesLoader({
      prefix: 'resources/locale-', // path to translations files
      suffix: '.json' // suffix, currently- extension of the translations
    });

    $translateProvider.preferredLanguage(LOCALES.preferredLocale); // is applied on first load
    //$translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage(); // saves selected language to localStorage

    // Enable sanitize of HTML
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  })
  // Angular Dynamic Locale
  .config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
  });
