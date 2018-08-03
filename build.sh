#!/bin/bash
set -xv

#sudo apt install phantomjs
#./node_modules/protractor/bin/webdriver-manager update --versions.chrome 2.41
npm run update-webdriver

./clean.sh

#mvn clean install -Dserver=jetty9x
./mvnw install -Dserver=jetty9x

docker build --target builder .
#docker build --target builder -t aandrieu/test:latest .

#sudo npm install -g npm-license
npm-license || true

docker-compose -f docker-compose.yml -p TEST ps

exit 0
