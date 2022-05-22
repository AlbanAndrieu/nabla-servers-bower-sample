#!/bin/bash
set -eu

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/scripts/step-0-color.sh"

echo -e "${magenta} ./node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update --versions.chrome 98.0.4758.102 ${NC}"
echo -e "${magenta} npm install -g bower@1.8.13 grunt-cli@1.4.3 webdriver-manager@12.1.8 ${NC}"
#npm run update-webdriver
#webdriver-manager update --chrome --versions.chrome=98.0.4758.102

#TODO
#npm install grunt-phantomas@0.14.0

#npm install --save-dev grunt-dev-update
#grunt devUpdate:main

echo -e "${magenta} grunt serve:dist --debug ${NC}"

./clean.sh

echo -e "${green} ./mvnw install -Dserver=jetty9x -Prun-integration-test ${NC}"
echo -e "${green} ./mvnw install -Prun-integration-test ${NC}"
./mvnw install -Prun-integration-test

echo -e "${magenta} ./mvnw clean install -DskipTests=true ${NC}"
echo -e "${magenta} ./mvnw com.github.ekryd.sortpom:sortpom-maven-plugin:sort -Dsort.keepBlankLines ${NC}"
echo -e "${magenta} ./mvnw clean install org.codehaus.cargo:cargo-maven2-plugin:run -Prun-integration-test ${NC}"
echo -e "${magenta} ./mvnw gplus:generateStubs gplus:groovydoc ${NC}"

#./docker-build.sh
#brew install hadolint
hadolint Dockerfile || true

npm list > list.log || true
#npm shrinkwrap

#sudo npm install -g npm-license
echo -e "${magenta} npm-license ${NC}"

#npm install -g npm-check-updates
#npx npm-check-updates
#ncu || true

#pip install checkov
#checkov -d  modules/site/

# Whiteshource is doing
npm ls --only=prod --json
mvn -T1 dependency:tree -DoutputFile=whitesource_mvn_dependency_tree.txt

#See https://www.baeldung.com/deploy-to-jetty
echo -e "${magenta} java -jar target/dependency/jetty-runner.jar target/test.war ${NC}"

./scripts/docker-build-runtime-20.sh

export DOCKER_TAG=${DOCKER_TAG:-"1.0.3"}

./scripts/helm-build.sh

docker-compose -f docker-compose/docker-compose.yml -p TEST ps

echo -e ""
echo -e "${green} Please validate the repo. ${happy_smiley} ${NC}"
echo -e "${magenta} git tag ${DOCKER_TAG} ${NC}"
echo -e "${magenta} git push origin --tags ${NC}"
echo -e ""

exit 0
