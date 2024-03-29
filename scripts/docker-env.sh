#!/bin/bash
#set -xv

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/step-0-color.sh"

#mkdir ./target/ || true
#cp ${WORKING_DIR}/target/test.war ./target/

# shellcheck disable=SC2154
echo -e "${magenta} Building TEST runtime image ${NC}"
# shellcheck disable=SC2154
echo -e "${green} pip install docker-compose==1.24.1 ${NC}"

if [ -n "${DOCKER_BUILD_ARGS}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_BUILD_ARGS is defined ${happy_smiley} : ${DOCKER_BUILD_ARGS} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_BUILD_ARGS, use the default one ${NC}"
  export DOCKER_BUILD_ARGS="--pull --target BUILD"
  #export DOCKER_BUILD_ARGS="--build-arg --no-cache --disable-content-trust=false"
  echo -e "${magenta} DOCKER_BUILD_ARGS : ${DOCKER_BUILD_ARGS} ${NC}"
fi

if [ -n "${CST_CONFIG}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} CST_CONFIG is defined ${happy_smiley} : ${CST_CONFIG} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : CST_CONFIG, use the default one ${NC}"
  export CST_CONFIG="docker/ubuntu18/config-BUILD.yaml" # build image
  #export CST_CONFIG="docker/ubuntu18/config-RUNTIME.yaml" # runtime image
  #export CST_CONFIG="docker/centos7/config.yaml" # runtime image
  echo -e "${magenta} CST_CONFIG : ${CST_CONFIG} ${NC}"
fi

if [ -n "${DOCKER_NAME}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_NAME is defined ${happy_smiley} : ${DOCKER_NAME} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_NAME, use the default one ${NC}"
  export DOCKER_NAME=${DOCKER_NAME:-"ansible-jenkins-slave-test"} # build image
  #export DOCKER_NAME=${DOCKER_NAME:-"nabla-servers-bower-sample"} # runtime image
  echo -e "${magenta} DOCKER_NAME : ${DOCKER_NAME} with ${CST_CONFIG} ${NC}"
fi

if [ -n "${DOCKER_TAG}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_TAG is defined ${happy_smiley} : ${DOCKER_TAG} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_TAG, use the default one ${NC}"
  export DOCKER_TAG=${DOCKER_TAG:-"latest"}
  echo -e "${magenta} DOCKER_TAG : ${DOCKER_TAG} ${NC}"
fi

if [ -n "${DOCKER_FILE}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_FILE is defined ${happy_smiley} : ${DOCKER_FILE} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_FILE, use the default one ${NC}"
  export DOCKER_FILE=${DOCKER_FILE:-"Dockerfile"}
  echo -e "${magenta} DOCKER_FILE : ${DOCKER_FILE} ${NC}"
fi

#readonly DOCKER_REGISTRY=${DOCKER_REGISTRY:-"https://hub.docker.com/"}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}
readonly DOCKER_ORGANISATION=${DOCKER_ORGANISATION:-"nabla"}
readonly DOCKER_USERNAME=${DOCKER_USERNAME:-"nabla"}
export DOCKER_NAME=${DOCKER_NAME:-"nabla-servers-bower-sample"}
export DOCKER_NAME_BUILD=${DOCKER_NAME_BUILD:-"ansible-jenkins-slave-test"}
export DOCKER_RUNTIME_NAME=${DOCKER_NAME:-"nabla-servers-bower-sample"}
export DOCKER_TAG=${DOCKER_TAG:-"latest"}

export HELM_CONTEXT=${HELM_CONTEXT:-"microk8s"}
export HELM_NAMESPACE=${HELM_NAMESPACE:-"jenkins"}
