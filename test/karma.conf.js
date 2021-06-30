"use strict";

module.exports = function (config) {

  const process = require('process');
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: "../",

    // frameworks to use
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-gravatar/build/angular-gravatar.js',
      'bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/spec/**/*.js",
    ],

    // list of files to exclude
    exclude: [],

    plugins: [
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-ie-launcher",
      "karma-junit-reporter",
      "karma-tapfile-reporter",
      "karma-coverage",
      "karma-jasmine",
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ["dots", "progress", "junit", "coverage"],

    preprocessors: {
      "app/**/*.js": ["coverage"],
    },

    coverageReporter: {
      //type: 'lcov',
      dir: "./target/karma-coverage",
      //file: 'lcov-karma.info'
      reporters: [
        // reporters not supporting the `file` property
        { type: "html", subdir: "report-html" },
        { type: "lcov", subdir: "report-lcov" },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: "cobertura", subdir: ".", file: "cobertura.txt" },
        { type: "lcovonly", subdir: ".", file: "lcov-karma.info" },
        //{ type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
        //{ type: 'text', subdir: '.', file: 'text.txt' },
        //{ type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
      ],
    },

    junitReporter: {
      //outputFile: './target/surefire-reports/TEST-default-KarmaTest.xml',
      outputDir: "./target/surefire-reports/",
      suite: "KarmaTest",
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
    // - PhantomJS (is dead : https://semaphoreci.com/blog/2018/03/27/phantomjs-is-dead-use-chrome-headless-in-continuous-integration.html)
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ["ChromeHeadlessNoSandbox"],
    //browsers: ["ChromiumHeadless"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          '--headless',
          '--no-sandbox',
          '--disable-gpu'
        ]
      },
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    browserDisconnectTolerance: 5,
    browserDisconnectTimeout : 30000,
    browserNoActivityTimeout: 30000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
  });
};
