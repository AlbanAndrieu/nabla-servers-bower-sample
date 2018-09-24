#!/bin/bash
set -xv

#sudo apt install phantomjs
#./node_modules/protractor/bin/webdriver-manager update --versions.chrome 2.41
#npm install -g bower@1.8.4 grunt@1.0.3 grunt-cli@1.2.0 nsp@2.6.1 webdriver-manager@12.1.0
npm run update-webdriver

./clean.sh

#mvn clean install -Dserver=jetty9x
./mvnw install -Dserver=jetty9x

#docker build --target builder .
#docker build --target builder -t aandrieu/test:latest .
#docker build --target runner .

npm list  > list.log

#sudo npm install -g npm-license
npm-license || true

docker-compose -f docker-compose.yml -p TEST ps

exit 0
