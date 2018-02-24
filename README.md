# nabla-servers-bower-sample
![nabla-projects-interview-visma](http://home.nabla.mobi/sample/images/mroizo.1f00120c.png)

[![License](http://img.shields.io/:license-apache-blue.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0.html)
[![Gitter](https://badges.gitter.im/nabla-servers-bower-sample/Lobby.svg)](https://gitter.im/nabla-servers-bower-sample/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Javascript project

## Build

[![Travis Build Status](https://travis-ci.org/AlbanAndrieu/nabla-servers-bower-sample.svg?branch=master)](https://travis-ci.org/AlbanAndrieu/nabla-servers-bower-sample)
[![Jenkins Build Status](http://home.nabla.mobi:8381/job/nabla-servers-bower-sample-nightly/badge/icon)](http://home.nabla.mobi:8381/job/nabla-servers-bower-sample-nightly)
[![Jenkins tests](https://img.shields.io/jenkins/t/https/jenkins.qa.ubuntu.com/view/Precise/view/All%20Precise/job/precise-desktop-amd64_default.svg)]()

## Quality

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=com.nabla.project.servers.sample%3Abower-sample&metric=alert_status)](https://sonarcloud.io/dashboard?id=com.nabla.project.servers.sample%3Abower-sample)
[![SonarQube Coverage](https://img.shields.io/sonar/http/sonar.qatools.ru/ru.yandex.qatools.allure:allure-core/coverage.svg)]()
[![SonarQube Tech Debt](https://img.shields.io/sonar/http/sonar.qatools.ru/ru.yandex.qatools.allure:allure-core/tech_debt.svg)]()

[![Versioneye Status](https://www.versioneye.com/user/projects/579bf122aa78d5003c17364a/badge.svg?style=flat)](https://www.versioneye.com/user/projects/579bf122aa78d5003c17364a)
[![Dependency Status](https://img.shields.io/david/AlbanAndrieu/nabla-servers-bower-sample.svg?style=flat-square)](https://david-dm.org/AlbanAndrieu/nabla-servers-bower-sample)
[![devDependency Status](https://img.shields.io/david/dev/AlbanAndrieu/nabla-servers-bower-sample.svg?style=flat-square)](https://david-dm.org/AlbanAndrieu/nabla-servers-bower-sample#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/AlbanAndrieu/nabla-servers-bower-sample)

[![Code Climate](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/badges/gpa.svg)](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample)
[![Test Coverage](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/badges/coverage.svg)](https://codeclimate.com/github/AlbanAndrieu/nabla-servers-bower-sample/coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/albanandrieu/nabla-servers-bower-sample/badge.svg)](https://snyk.io/test/github/albanandrieu/nabla-servers-bower-sample)
[![NSP Status](https://nodesecurity.io/orgs/nabla/projects/09223c07-0122-47bd-ab24-f0a4b6b6a38a/badge)](https://nodesecurity.io/orgs/nabla/projects/09223c07-0122-47bd-ab24-f0a4b6b6a38a)

[![Xing](http://www.xing.com/img/buttons/45_fr_btn.gif)](http://www.xing.com/profile/Alban_Andrieu)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=nabla)]()

<!--[![Xing](http://www.xing.com/img/buttons/45_fr_btn.gif)](http://www.xing.com/profile/Alban_Andrieu)-->

[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=nabla)](http://alban-andrieu.com)

A bower project sample.
=============

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.11.1.
Then I applied [uncss generator](https://github.com/addyosmani/generator-webapp-uncss)

This project is also used to test integration of build tools like:

 * private-bower (bower repo and caching)
 * nexus (npm and java packages repo and caching)
 * jenkins (continuous delivery in a jetty embedded)
 * sonar multi-languages and coverage (QA metrics except JIRA and perf metrics)
 * yeoman/nodejs/npm/grunt/bower and maven integration
 * zaproxy (security tests), checkmarx, dependency-check and nsp (thirdparty security check)
 * performance (jmx, phantomas, pagespeed, webpagetest, yslow, junitperf in jenkins)
 * sonar / stash / jira / jenkins /git /checkmarx integration

languages like :

 * javascript
	* unit tests (karma) + LCOV coverage
	* end2end tests (protractor)
 * java
	* unit tests (junit and jmockit) + Jacoco coverage
	* integration tests (junit) + Jacoco coverage
 * groovy
	* unit tests (junit) + Jacoco coverage
	* integration tests (junit) + Jacoco coverage

jmeter, gatling, mutation testing and arquillian are available in other sample project

## Create project

as local user
```
#npm install generator-angular
#npm install generator-angular-fullstack
yarn config set "strict-ssl" false -g
#yarn config set cafile ~/NABLA.crt
set NODE_TLS_REJECT_UNAUTHORIZED=0
yarn install
```

as local user
```
yo angular translate
```

TODO use https://angular-ui.github.io/bootstrap/ for language
TODO remvove app/styles/components/_header.scss language-select
TODO https://github.com/rackerlabs/angular-bootstrap-nav
SEE https://github.com/dlukez/angular-bootstrap-select/blob/master/angular-bootstrap-select.js
SEE https://github.com/angular-ui/angular-google-maps

## Internationalization

https://scotch.io/tutorials/internationalization-of-angularjs-applications

https://github.com/malyw/angular-translate-yeoman/compare/yeoman-angular-clean...master

## Quality tools

See [pre-commit](http://pre-commit.com/)
Run `pre-commit install`
Run `pre-commit autoupdate`

Run `pre-commit run --all-files`

Commit `git commit -am 'TEST' --no-verify`

## NODE/NPM Installation

```
#npm cache clean -f
npm install -g n
#n stable
n 8.9.4
node -v
/usr/local/bin/node -v
npm install -g npm@5.5.1
env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install -g puppeteer@0.12.0
env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn global add puppeteer
```

## Installation

Install NPM modules.

```js
sudo npm install.
```

Install Javascript dependencies.

```js
bower install
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

```
mvn clean install -Dserver=jetty9x
#mvn clean install -Dserver=jetty9x -Dskip.npm -Dskip.grunt -Dskip.bower -Dskip.yarn
mvn verify gpg:sign -Dgpg.passphrase=thephrase 2>&1 sign.log
npm ls --licenses
```

Run `mvn site -Dskip.npm -Dskip.yarn -Dskip.bower -Dskip.grunt` for building site.

as root
```
npm uninstall grunt-contrib-imagemin && npm install grunt-contrib-imagemin
```

## Fix imagemin upgrade

```
npm install optipng-bin@3.1.4
grunt imagemin:dist
```

## Testing

test (dev mode)
```
grunt serve watch -v
```

test (deployment mode)
```
grunt serve:dist
```

Running `grunt test` will run the unit tests with karma.

## Livereload

Run with grunt watch -v then manually edit a file listed in the watch.livereload.files array. Ensure that it is triggering the file by printing the file name to the console.

Then from the browser end, ensure going to http://localhost:35730/ works and displays {"tinylr":"Welcome","version":"0.2.1"} letting you know the live reload server is running.

Be sure the http://localhost:35730/livereload.js script is being loaded and you see the network socket being established.

## Proxy / Rewrite jetty

Proxy can be used to get access to oter URL.
In order to be activated it must be reached once : http://localhost:9090/login

Even though it is strongly advice to run this project behind an apache.
Please use : [ansible-web](https://github.com/AlbanAndrieu/ansible-web) in order to install this project behind an apache.

## Run war in jetty or using cargo

```
mvn jetty:run-war
mvn install org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x > install.log
```

## ZaProxy

Needed for having /usr/bin/xml2-config in the PATH

```
sudo apt-get install libxml2-dev libxslt-dev
```

Note that ZAProxy must be installed and zap.sh must be available on the executable path for this to work.
Make sure you are running zap 2.3.0 or 2.3.1

```
export PATH=/usr/local/zap/zap-2.3.0/:${PATH}
```

In case of trouble with zap locally.
Please deactivate html report in Gruntfile.js
html: false

Please use : [ansible-zaproxy](https://github.com/AlbanAndrieu/ansible-zaproxy) in order to install zaproxy

Start zap by hand:

```
sudo su - jenkins
export DISPLAY=:99 && nohup /usr/local/zap/zap-2.3.1/zap.sh -daemon -port 8090 > zap.log &
tail -f zap.log
```

## Selenium Grid

How to start selenium grid

```
#ssh -X root@home.nabla.mobi
sudo su - jenkins
#start by hand selenium grid
rm nohup.out
nohup java -jar /workspace/selenium-server-standalone-2.52.0.jar -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -role hub -port 4444 -host 192.168.0.29 -debug &
tail -f nohup.out
#check hub is working
INFO - Nodes should register to http://172.17.42.1:4444/grid/register/
#start by hand selenium instance for home.nabla.mobi
ssh -X jenkins@home.nabla.mobi
#https://github.com/SeleniumHQ/selenium/wiki/Grid2
#export DISPLAY=localhost:99.0 && nohup java -jar /workspace/selenium-server-standalone-2.52.0.jar -role node -hub http://home.nabla.mobi:4444/wd/register -browser browserName=firefox,version=38.0,firefox_binary=/usr/bin/firefox,maxInstances=1,platform=LINUX -browser browserName=chrome,version=39.0.2171.95,chrome_binary=/opt/google/chrome/chrome,maxInstances=1,platform=LINUX &
#export DISPLAY=localhost:99.0 && nohup java -jar /workspace/selenium-server-standalone-2.52.0.jar -role node -hub http://127.0.0.1:4444/grid/register -browser browserName=firefox,version=40.0,firefox_binary=/usr/bin/firefox,maxInstances=1,platform=LINUX -browser browserName=chrome,version=43.0.2357.125,chrome_binary=/usr/bin/google-chrome,maxInstances=1,platform=LINUX clean install -Dserver=jetty9x -Dsurefire.useFile=false -Psample,jacoco,integration,run-its,arq-weld-ee-embedded -Darquillian=arq-weld-ee-embedded -Darquillian.launch=arq-weld-ee-embedded -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -debug > selenum-hub.out 2>&1 &
export DISPLAY=localhost:99.0 && nohup java -jar /workspace/selenium-server-standalone-2.53.0.jar -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -role node -hub http://127.0.0.1:4444/grid/register -browser browserName=firefox,version=50.1.0,firefox_binary=/usr/bin/firefox,maxInstances=1,platform=LINUX -browser browserName=chrome,version=48.0.2564.116,chrome_binary=/usr/bin/google-chrome,maxInstances=1,platform=LINUX -debug > selenum-hub.out 2>&1 &
export DISPLAY=localhost:99.0 && nohup java -jar /workspace/selenium-server-standalone-2.53.0.jar -Dwebdriver.chrome.driver=/usr/lib/chromium-browser/chromedriver -role node -hub http://192.168.0.29:4444/grid/register -host 192.168.0.18 -timeout 500 -maxSession 2 -browser browserName=firefox,version=51.0.1,firefox_binary=/usr/bin/firefox,maxInstances=3,platform=LINUX -browser browserName=chrome,version=50.0.2661.102,chrome_binary=/usr/bin/google-chrome,maxInstances=3,platform=LINUX -debug > selenum-hub.out 2>&1 &
multitail nohup.out selenum-hub.out

curl http://localhost:4444/grid/api/proxy?id=http://172.17.42.1:5555
curl http://home.nabla.mobi:4444/grid/console

/usr/bin/google-chrome
/opt/google/chrome/chrome --> NOK

#On home.nabla.mobi check starter script at
#/etc/init.d/selenium_hub
```

Check result at :

curl http://home.nabla.mobi:4444/grid/console

http://home.nabla.mobi:4444/grid/console

http://192.168.0.29:5555/wd/hub/static/resource/hub.html

Please use : [ansible-selenium](https://github.com/AlbanAndrieu/ansible-selenium) in order to install selenium hub and node

## Jenkins

In order to properly configure Jenkins master

```
ADD /zapSource/build/zap in
sudo nano /etc/init/jenkins.conf
    export JENKINS_HOME
    export ZAPROXY_HOME=/zapSource/build/zap
    export PATH=$PATH:$ZAPROXY_HOME
```

## Screenshot

```
# First generate cookies file using protractor
grunt protractor
chmod 444 cookies.txt
rm ./target/test.png
phantomjs --debug=true --web-security=false --ignore-ssl-errors=true --cookies-file=./cookies.txt rasterize.js http://localhost:9090/ ./target/test.png
phantomjs --debug=true --web-security=false --ignore-ssl-errors=true --cookies-file=./cookies.txt netsniff.js http://localhost:9090/ > ./target/speed.har
#http://www.softwareishard.com/blog/har-viewer/
```

ls -lrta ~/.config/chromium/Default/Cookies
ls -lrta ~/.config/google-chrome/Default

## Yslow Psi WebPageTest

Run yslow, Psi or webpagetest

```
grunt yslow_test
phantomjs --ignore-ssl-errors=yes node_modules/grunt-yslow-test/tasks/lib/yslow.js --info basic --format plain http://localhost:9090/
grunt pagespeed
grunt wpt
```

## Deploy to internet

Page deployed at :

http://albanandrieu.github.io/nabla-servers-bower-sample/

In order to workaround issue of bower_components (cssmin) absolute path instead of releatif :
http://ignaciosuay.com/how-to-avoid-grunt-build-not-loading-bootstrap-glyphicons-using-jhipster/
https://github.com/yeoman/generator-angular/issues/1011

```
#VirtualHost *
sudo nano /etc/apache2/sites-available/awstats.conf
#VirtualHost *:7075
sudo nano /etc/apache2/sites-available/sample.conf
#Add the following
Alias /bower_components "/var/www/sample/bower_components"
```

## Performance improvements

What has been done is described at https://www.youtube.com/watch?v=FEs2jgZBaQA

## Issues

http://stackoverflow.com/questions/26332202/using-ui-bootstrap-causing-issues-with-carousel

## Run End2End tests

```
mvn clean install org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x
grunt --gruntfile Gruntfile-e2e.js
```

## Eclipse

 Uninstall Nodeclipse Core & Node.js

Add plugins

 - Groovy/Grails Tool Suite (GGTS) for Eclipse 3.6.4.RELEASE
 - Nodeclipse "Enide Studio 2014" is Tool Suite for Node.js
 - AngularJS Eclipse Plugin

### Import as Maven project

### Java

Project Properties | Java Build Path | Default output folder
Change target by target-eclipse
bower-sample/target-eclipse/classes

Exclude validation for

 - node
 - node_modules
 - bower_components
 - dist
 - app
 - coverage

### Javascript

WARNING : Javascript is not yet well supported in Eclipse

Project | Import as project "app"
Project Properties | JavasScript | Include Paths | Source | Add folders "script" "bower_components"

Based on the following sample : https://github.com/oasp/oasp4js

Project | Configure | Convert to AngularJS Project…
Project Properties | Resource | Link Resources |  ../bower_components
Project Properties | Tern | Script Paths | Add folder "app" -> JavaScript files and others available in project explorer
Project Properties | Resource | Resource Filters | Exclude | Exclude all | Name node_modules, Name dist -> fixes most Web Resource Problems

WARNING : Do not forget the / in order to be considered as a folder in bower_components/

Project Properties | Validation | Project specific settings | Web Resources Validator | Settings | Exclude Group | Folder: app/bower_components -> fixes "Undefined JavaScript file" in bower_components/
Project Properties | Validation | Project specific settings | HTML Angular Syntax Validator | Settings | Exclude Group | Folder: app/bower_components -> fixes "Undefined CSS class" in bower_components/

See https://github.com/oasp/oasp4js/issues/24 for more details

License
-------

Apache v2

## Other resources

Yo generator :
https://github.com/peterhendrick/openSource

Thanks for reading!

# Contributing

The [issue tracker](https://github.com/AlbanAndrieu/nabla-servers-bower-sample/issues) is the preferred channel for bug reports, features requests and submitting pull requests.

For pull requests, editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

License
-------

[Apache v2](http://www.apache.org/licenses/LICENSE-2.0.html)

***

Alban Andrieu [linkedin](fr.linkedin.com/in/nabla/)
