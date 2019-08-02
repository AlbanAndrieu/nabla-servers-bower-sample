'use strict';

//browser.ignoreSynchronization = false;

describe('Protractor Demo Sample', function() {
  //browser.driver.manage().window().maximize();

  //browser.sleep(10000);
  //browser.waitForAngular();

  beforeEach(function() {
    //var params = browser.params;
    //console.log('Opening browser... ' + browser.baseUrl + '/' + params.appContext);

    console.log('Opening browser... ' + browser.baseUrl);

  });

  it('should have a title', function() {

    expect(browser.getTitle()).toEqual('i18n for your AngularJS applications');

  });

  it('should have a text', function() {

    browser.get('#/project');

    //var data = element(by.css('.jumbotron.ng-scope'));
    var data = element(by.css('.jumbotron'));
    var header = data.element(by.tagName('h2'));
    expect(header.getText()).toContain('i18n for your AngularJS applications');

    //expect(header.getText()).toContain('\'Allo, \'Allo!');
  });

  //it('should have an about page', function() {
  //
  //  console.log('Opening browser... ' + browser.baseUrl + '/#/about');
  //
  //  browser.get('/#/about');
  //
  //  //var data = element(by.css('.jumbotron.ng-scope'));
  //  //var header = data.element(by.tagName('h1'));
  //  //expect(header.getText()).toContain('\'Allo, \'Allo!');
  //});

});
