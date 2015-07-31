# nabla-servers-bower-sample

[![Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/AlbanAndrieu/nabla-servers-bower-sample)
[![Jenkins Build Status](http://home.nabla.mobi:8380/jenkins/job/nabla-servers-bower-sample-nightly/badge/icon)](http://home.nabla.mobi:8380/jenkins/job/nabla-servers-bower-sample-nightly)

[![Code Climate](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/badges/gpa.svg)](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample) [![Test Coverage](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/badges/coverage.svg)](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/coverage)
[![Dependency Status](https://img.shields.io/david/AlbanAndrieu/nabla-servers-bower-sample.svg?style=flat-square)](https://david-dm.org/AlbanAndrieu/nabla-servers-bower-sample) [![devDependency Status](https://img.shields.io/david/dev/AlbanAndrieu/nabla-servers-bower-sample.svg?style=flat-square)](https://david-dm.org/AlbanAndrieu/nabla-servers-bower-sample#info=devDependencies)

```html
http://githubbadge.appspot.com/AlbanAndrieu
```

A bower project sample.
=============

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.11.1.
Then I applied [uncss generator](https://github.com/addyosmani/generator-webapp-uncss)

## Create project

as local user
```
npm install generator-angular
npm install generator-angular-fullstack
```

as local user
```
yo angular translate
```

TODO
grunt serve:dist

## Internationalization

https://scotch.io/tutorials/internationalization-of-angularjs-applications

https://github.com/malyw/angular-translate-yeoman/compare/yeoman-angular-clean...master

## Deploy

Page deployed at :

http://albanandrieu.github.io/nabla-servers-bower-sample/

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Proxy / Rewrite jetty

Proxy can be used to get access to oter URL.
In order to be activated it must be reached once : http://localhost:9090/login

Even though it is strongly advice to run this project behind an apache.
Please use : [ansible-web](https://github.com/AlbanAndrieu/ansible-web) in order to install this project behind an apache.

## Run war in jetty or cargo

```
mvn jetty:run-war
mvn org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x
```

## ZaProxy

Needed for having /usr/bin/xml2-config in the PATH

```
sudo apt-get install libxml2-dev libxslt-dev
```

Note that ZAProxy must be installed and zap.sh must be available on the executable path for this to work.
Make sure you are running zap 2.3.0

```
export PATH=/usr/local/zap/zap-2.3.0/:${PATH}
```

In case of trouble with zap locally.
Please deactivate html report in Gruntfile.js
html: false

Please use : [ansible-zaproxy](https://github.com/AlbanAndrieu/ansible-zaproxy) in order to install zaproxy

## Selenium Grid

How to start selenium grid

```
ssh -X root@home.nabla.mobi
#start by hand selenium grid
nohup java -jar /jenkins/selenium-server-standalone-2.45.0.jar -role hub -port 4444 &
#start by hand selenium instance for home.nabla.mobi
ssh -X jenkins@home.nabla.mobi
export DISPLAY=localhost:99.0 && nohup java -jar /jenkins/selenium-server-standalone-2.45.0.jar -role node -hub http://home.nabla.mobi:4444/wd/register -browser browserName=firefox,version=38.0,firefox_binary=/usr/bin/firefox,maxInstances=1,platform=LINUX -browser browserName=chrome,version=39.0.2171.95,chrome_binary=/opt/google/chrome/chrome,maxInstances=1,platform=LINUX &
#On home.nabla.mobi check starter script at
#/etc/init.d/selenium_hub
```

Check result at :

http://home.nabla.mobi:4444/grid/console

http://home.nabla.mobi:5555/wd/hub/static/resource/hub.html

Please use : [ansible-selenium](https://github.com/AlbanAndrieu/ansible-selenium) in order to install selenium hub and node

## Yslow Psi WebPageTest

Run yslow, Psi or webpagetest

```
grunt yslow
phantomjs yslow.js --info basic --format plain http://localhost:9090/
grunt pagespeed
grunt wpt
```

## Performance improvements

What has been done is described at https://www.youtube.com/watch?v=FEs2jgZBaQA
