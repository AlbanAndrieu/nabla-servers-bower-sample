#!/bin/bash
set -eu

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/scripts/step-0-color.sh"

#sudo apt install phantomjs
#./node_modules/protractor/bin/webdriver-manager update --versions.chrome 2.37
#npm install -g bower@1.8.4 grunt@1.0.3 grunt-cli@1.2.0 nsp@2.6.1 webdriver-manager@12.1.0
#npm run update-webdriver
#webdriver-manager update --chrome --versions.chrome=2.37

#TODO
#npm install grunt-phantomas@0.14.0

#npm install --save-dev grunt-dev-update
#grunt devUpdate:main

echo -e "${magenta} grunt serve:dist --debug ${NC}"

rm -f package-lock.json || true
./clean.sh

./mvnw install -Dserver=jetty9x -Prun-integration-test

echo -e "${green} ./mvnw clean install org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x -Prun-integration-test ${NC}"

#./docker-build.sh

npm list  > list.log || true
#npm shrinkwrap

#sudo npm install -g npm-license
npm-license || true

#See https://www.baeldung.com/deploy-to-jetty
echo -e "${magenta} java -jar target/dependency/jetty-runner.jar target/test.war ${NC}"

docker-compose -f docker-compose/docker-compose.yml -p TEST ps

echo -e "${magenta} Building helm testChart ${NC}"

#helm create charts
helm lint testChart/
helm package testChart/

exit 0
