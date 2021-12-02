#!/bin/bash
set -eu

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/scripts/step-0-color.sh"

#sudo apt install phantomjs
#./node_modules/protractor/bin/webdriver-manager update --versions.chrome 2.42
#npm install -g bower@1.8.4 grunt@1.0.3 grunt-cli@1.2.0 nsp@2.6.1 webdriver-manager@12.1.0
#npm run update-webdriver
#webdriver-manager update --chrome --versions.chrome=2.42

#TODO
#npm install grunt-phantomas@0.14.0

#npm install --save-dev grunt-dev-update
#grunt devUpdate:main

echo -e "${magenta} grunt serve:dist --debug ${NC}"

rm -f package-lock.json || true
./clean.sh

./mvnw install -Dserver=jetty9x -Prun-integration-test

echo -e "${magenta} ./mvnw clean install -DskipTests=true ${NC}"
echo -e "${magenta} ./mvnw com.github.ekryd.sortpom:sortpom-maven-plugin:sort -Dsort.keepBlankLines ${NC}"
echo -e "${magenta} ./mvnw clean install org.codehaus.cargo:cargo-maven2-plugin:run -Dserver=jetty9x -Prun-integration-test ${NC}"

#./docker-build.sh
#brew install hadolint
hadolint Dockerfile || true

npm list > list.log || true
#npm shrinkwrap

#sudo npm install -g npm-license
npm-license || true

# Whiteshource is doing
npm ls --only=prod --json
mvn -T1 dependency:tree -DoutputFile=whitesource_mvn_dependency_tree.txt

#See https://www.baeldung.com/deploy-to-jetty
echo -e "${magenta} java -jar target/dependency/jetty-runner.jar target/test.war ${NC}"

export DOCKER_TAG=${DOCKER_TAG:-"1.0.0"}

./scripts/docker-build-runtime-20.sh

echo -e "${magenta} Building helm helm-sample ${NC}"

export HELM_TAG=${HELM_TAG:-"1.0.0"}
echo -e "${magenta} k config get-contexts ${NC}"

export HELM_CONFIG_HOME=${HELM_CONFIG_HOME:-"${HOME}/.kube"}
export HELM_KUBECONTEXT=${HELM_KUBECONTEXT:-"microk8s"}
export HELM_NAMESPACE=${HELM_NAMESPACE:-"jenkins"}
export HELM_DEPLOYEMENT=${HELM_DEPLOYEMENT:-"helm-sample"}

echo -e "${magenta} helm lint ./packs/helm-sample/charts --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} ${NC}"

echo -e "${magenta} helm package ./packs/helm-sample/charts --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} --namespace ${HELM_NAMESPACE} --version ${HELM_TAG} --app-version ${DOCKER_TAG} --dependency-update ${NC}"
echo -e "${magenta} helm install --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} --namespace ${HELM_NAMESPACE} my-develop helm-sample-${HELM_TAG}.tgz --timeout 5m0s --wait --atomic --devel --replace --dependency-update --set imagePullPolicy=Always ${NC}"

#helm plugin install https://github.com/karuppiah7890/helm-schema-gen.git
echo -e "${magenta} helm schema-gen packs/helm-sample/values.yaml ${NC}"
#helm plugin install https://github.com/databus23/helm-diff
#echo -e "${magenta} helm diff upgrade my-develop ./packs/helm-sample ${NC}"
echo -e "${magenta} helmfile diff ${NC}"

docker-compose -f docker-compose/docker-compose.yml -p TEST ps

echo -e "${magenta} kubectl flame helm-sample -t 1m --lang java -f /tmp/flamegraph.svg --kubeconfig=$HOME/.kube/config ${NC}"

echo -e "${magenta} popeye --kubeconfig $HOME/.kube/config --context devops-nabla -save --out html --output-file popeye-test.html --cluster-name \"TEST OLD\" --namespace \"nabla-standalone-aandrieu\" -f k8s/spinach.yml ${NC}"
echo -e "${magenta} popeye --kubeconfig $HOME/.kube/config --context \"devops-nabla\" --out html ${NC}"

echo -e ""
echo -e "${green} Please validate the repo. ${happy_smiley} ${NC}"
echo -e "${magenta} git tag ${HELM_TAG} ${NC}"
echo -e "${magenta} git push origin --tags ${NC}"
echo -e ""

echo -e "${magenta} kompose convert -f docker-compose/docker-compose.yml -o base ${NC}"
echo -e "${magenta} cd base && kustomize create --autodetect ${NC}"
#skaffold completion bash > ~/.skaffold-completion
#skaffold init --force --skip-build

exit 0
