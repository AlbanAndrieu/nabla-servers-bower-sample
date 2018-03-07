/**
 * @ngdoc function
 * @name myTestApp.factory:LocaleService
 * @description
 * # LocaleService
 * Service for setting/getting current locale
 */
/*jshint strict: false */
angular.module('myTestApp')
  .service('LocaleService', function($translate, LOCALES, $rootScope, tmhDynamicLocale) {
    'use strict';
    // VARS
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
      console.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function(locale) {
      _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    console.log('\'translate \'me!');

    var currentLocale = $translate.proposedLanguage();// because of async loading

    // METHODS
    var checkLocaleIsValid = function(locale) {
      return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function(locale) {
      if (!checkLocaleIsValid(locale)) {
        console.error('Locale name "' + locale + '" is invalid');
        return;
      }
      startLoadingAnimation();
      currentLocale = locale;
      $translate.use(locale);
    };

    /**
     * Stop application loading animation when translations are loaded
     */
    var $html = angular.element('html');
    var LOADING_CLASS = 'app-loading';

    function startLoadingAnimation() {
      $html.addClass(LOADING_CLASS);
    }

    function stopLoadingAnimation() {
      $html.removeClass(LOADING_CLASS);
    }

    // EVENTS
    $rootScope.$on('$translateChangeSuccess', function(event, data) {
      console.log("It entered translateChangeSuccess");
      document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));// load Angular locale
    });

    $rootScope.today = new Date();

    $rootScope.$on('$localeChangeSuccess', function() {
      console.log('Event received if jquery is loaded before angular in index.html');
      stopLoadingAnimation();
    }

    );

    return {
      getLocaleDisplayName: function() {
        return localesObj[currentLocale];
      },
      setLocaleByDisplayName: function(localeDisplayName) {
        setLocale(
          _LOCALES[
            _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)// get locale index
            ]
        );
      },
      getLocalesDisplayNames: function() {
        return _LOCALES_DISPLAY_NAMES;
      }
    };
  });
