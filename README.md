# bower-sample

[![Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Jenkins Build Status](http://home.nabla.mobi:8380/jenkins/job/nabla-servers-bower-sample-nightly/badge/icon)](http://home.nabla.mobi:8380/jenkins/job/nabla-servers-bower-sample-nightly)

```html
http://githubbadge.appspot.com/AlbanAndrieu
```

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Needed for having /usr/bin/xml2-config in the PATH

```
sudo apt-get install libxml2-dev libxslt-dev
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Proxy

proxy is used to get riskinsight.
In order to be activated it must be reached once : http://localhost:9090/login

Then you can go to : http://localhost:9090/

## Run war in jetty

```
mvn clean install jetty:run-war
```

## Zap

Note that ZAProxy must be installed and zap.sh must be available on the executable path for this to work.
Make sure you are running zap 2.3.0

```
export PATH=/usr/local/zap/zap-2.3.0/:${PATH}
```

In case of trouble with zap.
Please deactivate html report in Gruntfile.js
html: false

## Selenium Grid

How to start selenium grid

```
ssh -X root@home.nabla.mobi
#start by hand selenium grid
nohup java -jar /local/Jenkins-slave/selenium-server-standalone-2.45.0.jar -role hub -port 4444 &
#start by hand selenium instance for home.nabla.mobi
ssh -X jenkins@home.nabla.mobi
export DISPLAY=localhost:99.0 && nohup java -jar /local/Jenkins-slave/selenium-server-standalone-2.45.0.jar -role node -hub http://home.nabla.mobi:4444/wd/register -browser browserName=firefox,version=38.0,firefox_binary=/usr/bin/firefox,maxInstances=1,platform=LINUX -browser browserName=chrome,version=39.0.2171.95,chrome_binary=/opt/google/chrome/chrome,maxInstances=1,platform=LINUX &
#On home.nabla.mobi check starter script at
#/etc/init.d/selenium_hub
```

Check result at :

http://home.nabla.mobi:4444/grid/console

http://home.nabla.mobi:5555/wd/hub/static/resource/hub.html

## Yslow Psi WebPageTest

Run yslow, Psi or webpagetest

```
grunt yslow
phantomjs yslow.js --info basic --format plain http://localhost:9090/
grunt pagespeed
grunt wpt
```
