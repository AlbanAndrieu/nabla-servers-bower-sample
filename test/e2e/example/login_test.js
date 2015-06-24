'use strict';

browser.ignoreSynchronization = false;

describe('Protractor Demo Sample', function() {
  browser.driver.manage().window().maximize();

  //browser.sleep(10000);
  //browser.waitForAngular();

  beforeEach(function() {
	//var params = browser.params;
	//console.log('Opening browser... ' + browser.baseUrl + '/' + params.appContext);
    //
    //browser.get('/' + params.appContext + 'index.jsp#/indicators');
	console.log('Opening browser... ' + browser.baseUrl + '/#/');

    browser.get('/');

  });

  it('should have a title', function() {

    expect(browser.getTitle()).toEqual('Sample');
  });

  it('should have a text', function() {

    browser.get('/');

    var data = element(by.css('.jumbotron.ng-scope'));
	var header = data.element(by.tagName('h1'));
    expect(header.getText()).toContain('\'Allo, \'Allo!');
  });

  //it('should login to Sample', function() {
  //  var params = browser.params;
  //
  //  var login = element(by.id('login-input'));
  //  login.clear();
  //  login.sendKeys(params.userName);
  //
  //  var password = element(by.id('password-input')).click();
  //  password.clear();
  //  password.sendKeys(params.userPassword);
  //
  //  element(by.id('submit_btn')).click();
  //
  //  // Login takes some time, so wait until it's done.
  //  // For the test app's login, we know it's done when it redirects to
  //  // index.html.
  //  return browser.driver.wait(function() {
  //    return browser.driver.getCurrentUrl().then(function(url) {
  //      return /index/.test(url);
  //    });
  //  }, 10000);
  //
  //  expect(element(by.css('.icon-login')).isDisplayed()).toBe(true);
  //
  //  //browser.sleep(4000);
  //});

});
