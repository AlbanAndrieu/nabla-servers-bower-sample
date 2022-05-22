#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

echo -e "${magenta} Building helm helm-sample ${NC}"

export HELM_TAG=${HELM_TAG:-"1.0.0"}
echo -e "${magenta} k config get-contexts ${NC}"

export HELM_CONFIG_HOME=${HELM_CONFIG_HOME:-"${HOME}/.kube"}
export HELM_KUBECONTEXT=${HELM_KUBECONTEXT:-"microk8s"}
export HELM_NAMESPACE=${HELM_NAMESPACE:-"jenkins"}
export HELM_DEPLOYEMENT=${HELM_DEPLOYEMENT:-"helm-sample"}

echo -e "${magenta} helm lint ./packs/helm-sample/charts --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} ${NC}"

echo -e "${magenta} helm package ./packs/helm-sample/charts --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} --namespace ${HELM_NAMESPACE} --version ${HELM_TAG} --app-version ${DOCKER_TAG} --dependency-update ${NC}"
echo -e "${magenta} helm uninstall --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} --namespace ${HELM_NAMESPACE} my-develop ${NC}"
echo -e "${magenta} helm install --kubeconfig ${HELM_CONFIG_HOME}/config --kube-context ${HELM_KUBECONTEXT} --namespace ${HELM_NAMESPACE} my-develop helm-sample-${HELM_TAG}.tgz --timeout 5m0s --wait --atomic --devel --replace --dependency-update --set imagePullPolicy=Always ${NC}"

#helm plugin install https://github.com/karuppiah7890/helm-schema-gen.git
echo -e "${magenta} helm schema-gen packs/helm-sample/values.yaml ${NC}"
#helm plugin install https://github.com/databus23/helm-diff
#echo -e "${magenta} helm diff upgrade my-develop ./packs/helm-sample ${NC}"
echo -e "${magenta} helmfile diff ${NC}"

echo -e "${magenta} kubectl flame helm-sample -t 1m --lang java -f /tmp/flamegraph.svg --kubeconfig=$HOME/.kube/config ${NC}"

echo -e "${magenta} popeye --kubeconfig $HOME/.kube/config --context devops-nabla -save --out html --output-file popeye-test.html --cluster-name \"TEST OLD\" --namespace \"nabla-standalone-aandrieu\" -f k8s/spinach.yml ${NC}"
echo -e "${magenta} popeye --kubeconfig $HOME/.kube/config --context \"devops-nabla\" --out html ${NC}"

echo -e "${magenta} kompose convert -f docker-compose/docker-compose.yml -o base ${NC}"
echo -e "${magenta} cd base && kustomize create --autodetect ${NC}"
#skaffold completion bash > ~/.skaffold-completion
#skaffold init --force --skip-build

exit 0
