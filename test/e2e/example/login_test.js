'use strict';

browser.ignoreSynchronization = false;

describe('Protractor Demo Sample', function() {
  browser.driver.manage().window().maximize();

  browser.sleep(10000);
  browser.waitForAngular();

  beforeEach(function() {
	var params = browser.params;
	console.log('Opening browser... ' + browser.baseUrl + '/' + params.appContext);

    //browser.wait(function() {
    //  return browser.executeScript('return !!window.angular');
    //}, 5000); // 5000 is the timeout in millis

    browser.get('/' + params.appContext + 'index.html');
  });

  it('should have a title', function() {

    expect(browser.getTitle()).toEqual('Sample');
  });

  it('should login to Sample', function() {
    var params = browser.params;

    var login = element(by.id('login-input'));
    login.clear();
    login.sendKeys(params.userName);

    var password = element(by.id('password-input')).click();
    password.clear();
    password.sendKeys(params.userPassword);

    element(by.css('button')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return /index/.test(url);
      });
    }, 10000);

    expect(element(by.css('.icon-login')).isDisplayed()).toBe(true);

    //browser.sleep(4000);
  });

});
