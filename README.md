# bower-sample

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
