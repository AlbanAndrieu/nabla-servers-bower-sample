"use strict";

exports.config = {
  // Specify you want to use jasmine 2.x as you would with mocha and cucumber.
  framework: "jasmine2",
  //seleniumAddress: 'http://home.nabla.mobi:4444/wd/hub',
  specs: ["e2e/example/*_test.js"],
  //baseUrl: 'http://' + process.env.SERVER_HOST + ':' + process.env.JETTY_PORT,
  //baseUrl: 'https://localhost:' + ( process.env.SERVER_SECURE_PORT || 9443 ),
  //baseUrl: 'http://localhost:' + ( process.env.SERVER_PORT || 9090 ),
  //baseUrl: 'http://localhost:' + ( process.env.SERVER_PORT || 9014 ),
  //baseUrl: 'http://localhost:9090', //default test port with Jetty
  //baseUrl: 'http://localhost:8001', //default test port with Yeoman
  directConnect: false, // bypass selenium
  params: {
    userName: "nabla",
    userPassword: "microsoft",
    //resetPassword: 'microsoft',
    appContext: "/",
  },
  capabilities: {
    //'browserName': 'chromium',
    browserName: "chrome",
    //'browserName': 'firefox',
    chromeOptions: {
      //  binary: '/usr/bin/google-chrome',
      //extensions: [],
      args: [
        "--no-sandbox",
        "--verbose",
        "--log-path=chromedriver.log",
        //'show-fps-counter=true',
        //'--window-size=800,600',
        "--disable-extensions",
        //                 '--start-maximized',
        //                 '--remote-debugging-port=9222',
        //                 '--incognito',
        "--disable-setuid-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-infobars",
        "--ignore-certificate-errors",
        "--disable-popup-blocking",
        "--disable-translate",
        "--disable-web-security",
        "--test-type=browser",
        "--enable-file-cookies",
        "--allow-file-access-from-files",
        //--proxy-server=host:port
      ],
      prefs: {
        downloads: {
          prompt_for_download: false,
          directory_upgrade: true,
          default_directory: "/tmp/downloads/",
        },
      },
    },
    "phantomjs.cli.args": [
      "--cookies-file=./target/cookies.txt",
      "--web-security=false",
      "--ignore-ssl-errors=true",
      "--webdriver-loglevel=DEBUG",
      //'--debug',
      //'--verbose',
      //'--proxy=127.0.0.1:' + ( process.env.ZAP_PORT || 8090 ),
      //'--proxy-type=none',
    ],
    "moz:firefoxOptions": {
      args: ["--headless", "--safe-mode"],
    },
    //chromeOptions: {
    //  binary: '/usr/bin/google-chrome',
    //  args: [],
    //  extensions: [],
    //},
    acceptSslCerts: true,
    //'--cookies-keep-session', '--keep-session-cookies'
    ensureCleanSession: true,
    //proxy: {
    //   //proxyType: 'autodetect'
    //   proxyType: 'manual',
    //   httpProxy: 'localhost:' + ( process.env.ZAP_PORT || 8090 ),
    //   sslProxy: 'localhost:' + ( process.env.ZAP_PORT || 8090 ),
    //   noProxy: ''
    //}
  },

  //seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
  //seleniumServerJar: './node_modules/grunt-protractor-runner/node_modules/protractor/selenium/selenium-server-standalone-2.51.0.jar',
  //seleniumServerJar: '/workspace/selenium-server-standalone-2.53.0.jar',
  //seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.6.0.jar'
  //chromeDriver: './node_modules/protractor/selenium/chromedriver_2.21',
  //chromeDriver: './node_modules/grunt-protractor-runner/node_modules/protractor/selenium/chromedriver',
  //chromeDriver: '/usr/lib/chromium-browser/chromedriver',
  //chromeDriver: '/usr/local/bin/chromedriver',
  chromeDriver: '/usr/bin/chromedriver',

  // chromeDriver: require(`chromedriver/lib/chromedriver`).path,

  SELENIUM_PROMISE_MANAGER: false,

  onPrepare: function () {
    browser.executeScript('window.name = "NG_ENABLE_DEBUG_INFO"');

    /* global angular: false, browser: false, jasmine: false */

    // Disable animations so e2e tests run more quickly
    var disableNgAnimate = function () {
      angular.module("disableNgAnimate", []).run([
        "$animate",
        function ($animate) {
          $animate.enabled(false);
        },
      ]);
    };

    browser.addMockModule("disableNgAnimate", disableNgAnimate);

    // Store the name of the browser that's currently being used.
    browser.getCapabilities().then(function (caps) {
      browser.params.browser = caps.get("browserName");
    });

    //require('jasmine-bail-fast');
    //jasmine.getEnv().bailFast();

    var jasmineReporters = require("jasmine-reporters");
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        filePrefix: "TEST-com.test.project.sample.Protractor",
        savePath: "target/surefire-reports",
      })
    );

    //browser.ignoreSynchronization = true; //enable for non angular
    //browser.waitForAngularEnabled(false);

    //https://github.com/angular/protractor/issues/1978
    //browser.driver.manage().window().maximize();
    return browser.get(browser.baseUrl);
    //return browser.get('http://localhost:' + ( process.env.SERVER_PORT || 9014 ));
    //return browser.get('https://localhost:' + ( process.env.SERVER_SECURE_PORT || 9443 ));
  },
  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],
  // https://github.com/angular/protractor/blob/master/docs/timeouts.md
  allScriptsTimeout: 110000, // 10000000

  // Selector for the element housing the angular app - this defaults to
  // body, but is necessary if ng-app is on a descendant of <body>
  //rootElement: 'body',
  // ----- Options to be passed to minijasminenode -----
  jasmineNodeOpts: {
    // If true, print colors to the terminal.
    showColors: true, // Use colors in the command line report
    //isVerbose: true, // List all tests in the console
    showTiming: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 90000,
    // Function called to print jasmine results.
    print: function () {},
    // If set, only execute specs whose names match the pattern, which is
    // internally compiled to a RegExp.
    //grep: 'pattern',
    // Inverts 'grep' matches
    invertGrep: false,
  },
};
