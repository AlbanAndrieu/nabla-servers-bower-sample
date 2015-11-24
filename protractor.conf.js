'use strict';

exports.config = {
  // Specify you want to use jasmine 2.x as you would with mocha and cucumber.
  framework: 'jasmine2',
  //seleniumAddress: 'http://home.nabla.mobi:4444/wd/hub',
  specs: ['test/e2e/example/*_test.js'],
  //baseUrl: 'http://' + process.env.SERVER_HOST + ':' + process.env.JETTY_PORT,
  //baseUrl: 'http://localhost:' + ( process.env.SERVER_PORT || 9090 ),
  //baseUrl: 'http://localhost:' + ( process.env.SERVER_PORT || 9014 ),
  //baseUrl: 'http://localhost:9090', //default test port with Jetty
  //baseUrl: 'http://localhost:8001', //default test port with Yeoman
  //directConnect: true,  //bypass selenium
  params: {
    userName: 'nabla',
    userPassword: 'microsoft',
	//resetPassword: 'microsoft',
    appContext: '/'
  },
  capabilities: {
    //'browserName': 'chromium',
    'browserName': 'chrome',
    //  'browserName': 'firefox',
    //'browserName': 'phantomjs',
    'chromeOptions': {
        'args': ['--incognito', '--disable-extensions', '--start-maximized', '--no-sandbox', '--ignore-certificate-errors', '--disable-popup-blocking', '--disable-translate', '--disable-web-security', '--test-type=browser'],
        'prefs': {
                'downloads': {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': '/tmp/downloads/'
                }
        }
    },
    'phantomjs.cli.args': ['--cookies-file=./target/cookies.txt',
                           //'--web-security=false',
                           '--ignore-ssl-errors=true',
                           '--webdriver-loglevel=DEBUG',
                           //'--proxy=127.0.0.1:' + ( process.env.ZAP_PORT || 8090 ),
                           ],
	//chromeOptions: {
	//	binary: '/usr/bin/google-chrome',
	//	args: [],
	//	extensions: [],
	//},
	//acceptSslCerts: true,
	//ensureCleanSession: true,
    proxy: {
       //proxyType: 'autodetect'
       proxyType: 'manual',
       httpProxy: 'localhost:' + ( process.env.ZAP_PORT || 8090 ),
       sslProxy: 'localhost:' + ( process.env.ZAP_PORT || 8090 ),
       noProxy: ''
    }
  },

  chromeDriver: './node_modules/protractor/selenium/chromedriver',
  //chromeDriver: './node_modules/grunt-protractor-runner/node_modules/protractor/selenium/chromedriver',
  //seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  //seleniumServerJar: './node_modules/grunt-protractor-runner/node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',

  onPrepare: function() {
	  browser.executeScript('window.name = "NG_ENABLE_DEBUG_INFO"');

      /* global angular: false, browser: false, jasmine: false */

      // Disable animations so e2e tests run more quickly
      var disableNgAnimate = function() {
        angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
          $animate.enabled(false);
        }]);
      };

      browser.addMockModule('disableNgAnimate', disableNgAnimate);

      // Store the name of the browser that's currently being used.
      browser.getCapabilities().then(function(caps) {
        browser.params.browser = caps.get('browserName');
      });

      //var failFast = require('jasmine-fail-fast');
      //jasmine.getEnv().addReporter(failFast.init());
      //require('jasmine-bail-fast');
      //jasmine.getEnv().bailFast();

      // The require statement must be down here, since jasmine-reporters@1.0
      // expects jasmine to be in the global and protractor does not guarantee
      // this until inside the onPrepare function.
      //require('jasmine-reporters');
      //jasmine.getEnv().addReporter(
      //    new jasmine.JUnitXmlReporter('target/surefire-reports', true, true)
      //);
      var jasmineReporters = require('jasmine-reporters');
      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
          consolidateAll: true,
          filePrefix: 'TEST-default-Protractor',
          savePath: 'target/surefire-reports'
      }));

	  var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
      jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));

     //browser.ignoreSynchronization = true; //enable for non angular

      //https://github.com/angular/protractor/issues/1978
      browser.driver.manage().window().maximize();
      //return browser.get('http://localhost:' + ( process.env.SERVER_PORT || 9014 ));
      return browser.get('https://localhost:' + ( process.env.SERVER_SECURE_PORT || 8443 ));
      //return browser.get('http://localhost:9014');

  },
  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],
  allScriptsTimeout: 10000000,
  // Selector for the element housing the angular app - this defaults to
  // body, but is necessary if ng-app is on a descendant of <body>
  //rootElement: 'body',
  // ----- Options to be passed to minijasminenode -----
  jasmineNodeOpts: {
      // If true, print colors to the terminal.
      showColors: true, // Use colors in the command line report
      //isVerbose: true, // List all tests in the console
      //showTiming: true,
      // Default time to wait in ms before a test fails.
      defaultTimeoutInterval: 30000,
      // Function called to print jasmine results.
      print: function() {},
      // If set, only execute specs whose names match the pattern, which is
      // internally compiled to a RegExp.
      //grep: 'pattern',
      // Inverts 'grep' matches
      invertGrep: false
  }
}
