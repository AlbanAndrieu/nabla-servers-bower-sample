'use strict';

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-audio/app/angular.audio.js',
      'bower_components/flow.js/dist/flow.js',
      'bower_components/ng-flow/dist/ng-flow.js',
      'bower_components/fusty-flow.js/src/fusty-flow.js',
      'bower_components/fusty-flow.js/src/fusty-flow-factory.js',
      'bower_components/sample-component/sample-component.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-ie-launcher',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-jasmine'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots', 'progress', 'junit', 'coverage'],

    preprocessors: {
      'app/**/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: './target/karma-coverage'
    },

    junitReporter: {
      outputFile: './target/surefire-reports/TEST-default-KarmaTest.xml',
      suite: ''
    },

    // web server port
    port: 9877,

    // cli runner port
    runnerPort: 9101,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
