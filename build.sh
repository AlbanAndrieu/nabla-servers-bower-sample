#!/bin/bash
set -eu

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/scripts/step-0-color.sh"

# "${WORKING_DIR}/scripts/install.sh"

# "${WORKING_DIR}/scripts/webdriver.sh"

echo -e "${magenta} Stop service on same port ${NC}"
sudo lsof -i :9090 || true
sudo service prometheus stop || true

#  Error message: No update-config.json found. Run 'webdriver-manager update' to download binaries.
webdriver-manager update

#npm install --save-dev grunt-dev-update
echo -e "${magenta} yarn install --immutable ${NC}"
#grunt devUpdate:main

echo -e "${magenta} grunt serve:dist --debug ${NC}"

# "${WORKING_DIR}/scripts/clean.sh"

echo -e "${green} ./mvnw install -Dserver=jetty9x -Prun-integration-test ${NC}"
echo -e "${green} ./mvnw install -Prun-integration-test ${NC}"
./mvnw install -Prun-integration-test

echo -e "${magenta} ./mvnw clean install -DskipTests=true ${NC}"
echo -e "${magenta} ./mvnw com.github.ekryd.sortpom:sortpom-maven-plugin:sort -Dsort.keepBlankLines ${NC}"
echo -e "${magenta} ./mvnw clean install org.codehaus.cargo:cargo-maven2-plugin:run -Prun-integration-test ${NC}"
echo -e "${magenta} ./mvnw gplus:generateStubs gplus:groovydoc ${NC}"

# "${WORKING_DIR}/scripts/docker-validate.sh"

npm list >list.log || true
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
mvn -T1 dependency:tree -Dserver=jetty9x -Prun-integration-test -s settings.xml -DoutputFile=./target/mvn_dependency_tree.txt

#See https://www.baeldung.com/deploy-to-jetty
echo -e "${magenta} java -jar target/dependency/jetty-runner.jar target/test.war ${NC}"

export DOCKER_TAG=${DOCKER_TAG:-"2.2.0"}

./scripts/docker-build-runtime-22.sh # 1>docker-build-runtime-22.log 2>docker-build-runtime-22-error.log

echo -e "${magenta} dependency-check.sh --project \"Nabla Servers Bower Sample\"  --out . --scan .  --format \"ALL\" ${NC}"

dependency-check.sh --project "Nabla Servers Bower Sample" --out ./target --scan . --format "ALL" 1>dependency-check.log 2>dependency-check-error.log || true

./scripts/helm-build.sh

docker-compose -f docker-compose/docker-compose.yml -p TEST ps

echo -e ""
echo -e "${green} Please validate the repo. ${happy_smiley} ${NC}"
echo -e "${magenta} git tag ${DOCKER_TAG} ${NC}"
echo -e "${magenta} git push origin --tags ${NC}"
echo -e ""

exit 0
