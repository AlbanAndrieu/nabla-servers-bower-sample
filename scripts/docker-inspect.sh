#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

echo -e "${green} Security ${NC}"
echo -e "${magenta} docker_bench_security ${NC}"

export HELM_CONTEXT=${HELM_CONTEXT:-"microk8s"}    # devops-nabla
export HELM_NAMESPACE=${HELM_NAMESPACE:-"jenkins"} # nabla-standalone-aandrieu-pr
export HELM_HOME=${HELM_HOME:-"${HOME}"}                 # /home/jenkins

docker run -it --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/lib/systemd:/usr/lib/systemd \
  -v /etc:/etc --label docker_bench_security \
  docker/docker-bench-security

echo -e "${green} Quality popeye ${NC}"
echo -e "${magenta} docker run --rm  -v ${HELM_HOME}/.kube:/root/.kube -v $(pwd):/tmp --workdir /tmp -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro --group-add 2000 --group-add 1101 --group-add 998 --group-add 789 quay.io/derailed/popeye --save --out html --output-file popeye.html --context ${HELM_CONTEXT} --namespace ${HELM_NAMESPACE} -f k8s/spinach.yml  ${NC}"
# shellcheck disable=SC2046
docker run --rm -v ${HELM_HOME}/.kube:/root/.kube -v $(pwd):/tmp --workdir /tmp -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro --group-add 2000 --group-add 1101 --group-add 998 --group-add 789 quay.io/derailed/popeye --save --out html --output-file "popeye.html" --context "${HELM_CONTEXT}" --namespace "${HELM_NAMESPACE}" -f k8s/spinach.yml

echo -e "${magenta} sudo lynis audit dockerfile docker/ubuntu20/Dockerfile ${NC}"

exit 0
