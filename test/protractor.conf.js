'use strict';

exports.config = {
  // Specify you want to use jasmine 2.x as you would with mocha and cucumber.
  framework: 'jasmine2',
  seleniumAddress: 'http://home.nabla.mobi:4444/wd/hub',
  //seleniumAddress: 'http://kgrdb01:4444/wd/hub',
  specs: ['e2e/example/*_test.js'],
  //baseUrl: 'http://' + process.env.SERVER_HOST + ':' + process.env.JETTY_PORT,
  baseUrl: 'http://home.nabla.mobi:9090',
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
    'browserName': 'firefox',
    proxy: {
       proxyType: 'manual',
       //httpProxy: 'localhost:' + process.env.ZAP_PORT,
       httpProxy: 'localhost:8090',
       sslProxy: '',
       noProxy: ''
    }
  },
  onPrepare: function() {
      var jasmineReporters = require('jasmine-reporters');
      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
          consolidateAll: true,
          filePrefix: 'TEST-default-Protractor',
          savePath: 'target/surefire-reports'
      }));
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
      showColors: true,
      // Default time to wait in ms before a test fails.
      defaultTimeoutInterval: 30000,
      // Function called to print jasmine results.
      print: function() {},
      // If set, only execute specs whose names match the pattern, which is
      // internally compiled to a RegExp.
      grep: 'pattern',
      // Inverts 'grep' matches
      invertGrep: false
  }
}
