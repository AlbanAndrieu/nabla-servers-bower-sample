#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
tput colors && source "${WORKING_DIR}/../step-0-color.sh"

export DOCKER_NAME=$1

echo "DOCKER_NAME : $DOCKER_NAME"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

#export DOCKER_TAG=$2
#if [[ $DOCKER_TAG == "" ]]; then
#    echo "Missing DOCKER_TAG"
#fi

# shellcheck disable=SC2154
echo -e "${magenta} Testing TEST runtime image ${NC}"

#echo -e "docker pull gcr.io/gcp-runtimes/container-structure-test:latest ${NC}"
#docker pull gcr.io/gcp-runtimes/container-structure-test:latest

if [ -f /usr/local/bin/container-structure-test ]; then
  echo "container-structure-test file found"
else
  curl -LO https://storage.googleapis.com/container-structure-test/latest/container-structure-test-linux-amd64 && chmod +x container-structure-test-linux-amd64 && mkdir -p $HOME/bin && export PATH=$PATH:$HOME/bin && mv container-structure-test-linux-amd64 $HOME/bin/container-structure-test
  #curl -LO https://storage.googleapis.com/container-structure-test/latest/container-structure-test-linux-amd64 && chmod +x container-structure-test-linux-amd64 && sudo mv container-structure-test-linux-amd64 /usr/local/bin/container-structure-test
fi

echo -e "container-structure-test test --image ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG} --config ${CST_CONFIG} ${NC}"
/usr/local/bin/container-structure-test test --image "${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}" --config ${CST_CONFIG}

exit 0
