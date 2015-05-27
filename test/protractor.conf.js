'use strict';

exports.config = {
  seleniumAddress: 'http://home.nabla.mobi:4444/wd/hub',
  specs: ['e2e/example/*_test.js'],
  baseUrl: 'http://home.nabla.mobi:9090',
  //baseUrl: 'http://localhost:9090', //default test port with Jetty
  //baseUrl: 'http://localhost:8001', //default test port with Yeoman
  //directConnect: true,  //bypass selenium
  params: {
    userName: 'nabla',
    userPassword: 'microsoft',
	//resetPassword: 'microsoft',
    appContext: 'login/'
  },
  capabilities: {
    'browserName': 'firefox',
    proxy: {
       proxyType: 'manual',
       httpProxy: 'localhost:8090',
       sslProxy: '',
       noProxy: ''
    }
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
    // onComplete will be called just before the driver quits.
    onComplete: null,
    // If true, display spec names.
    isVerbose: true,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: false,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 100000000
  }
}
