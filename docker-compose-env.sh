#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

source "${WORKING_DIR}/step-0-color.sh"

# shellcheck disable=SC2154
echo -e "${magenta} Make sure you have at least docker-compose==1.22.0 ${NC}"
# shellcheck disable=SC2154
echo -e "${green} pip install docker-compose==1.22.0 ${NC}"

if [ -n "${DOCKER_TAG}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_TAG is defined ${happy_smiley} : ${DOCKER_TAG} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_TAG, use the default one ${NC}"
  export DOCKER_TAG="TEST"
  echo -e "${magenta} DOCKER_TAG : ${DOCKER_TAG} ${NC}"
fi

if [ -n "${DOCKER_COMPOSE_OPTIONS}" ]; then
  echo -e "${green} DOCKER_COMPOSE_OPTIONS is defined ${happy_smiley} : ${DOCKER_COMPOSE_OPTIONS} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_COMPOSE_OPTIONS, use the default one ${NC}"
  export DOCKER_COMPOSE_OPTIONS="-p ${DOCKER_TAG}"
  echo -e "${magenta} DOCKER_COMPOSE_OPTIONS : ${DOCKER_COMPOSE_OPTIONS} ${NC}"
fi

if [ -n "${DOCKER_COMPOSE_UP_OPTIONS}" ]; then
  echo -e "${green} DOCKER_COMPOSE_UP_OPTIONS is defined ${happy_smiley} : ${DOCKER_COMPOSE_UP_OPTIONS} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_COMPOSE_UP_OPTIONS, use the default one ${NC}"
  export DOCKER_COMPOSE_UP_OPTIONS="--force-recreate -d mysql"
  echo -e "${magenta} DOCKER_COMPOSE_UP_OPTIONS : ${DOCKER_COMPOSE_UP_OPTIONS} ${NC}"
fi

if [ -n "${ADDITIONAL_ROBOT_OPTS}" ]; then
  echo -e "${green} ADDITIONAL_ROBOT_OPTS is defined ${happy_smiley} : ${ADDITIONAL_ROBOT_OPTS} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : ADDITIONAL_ROBOT_OPTS, use the default one ${NC}"
  export ADDITIONAL_ROBOT_OPTS="-s PipelineTests.TEST"
  echo -e "${magenta} ADDITIONAL_ROBOT_OPTS : ${ADDITIONAL_ROBOT_OPTS} ${NC}"
fi

if [ -n "${ROBOT_RESULTS_PATH}" ]; then
  echo -e "${green} ROBOT_RESULTS_PATH is defined ${happy_smiley} : ${ROBOT_RESULTS_PATH} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : ROBOT_RESULTS_PATH, use the default one ${NC}"
  export ROBOT_RESULTS_PATH="/tmp/nabla-000-000"
  echo -e "${magenta} ROBOT_RESULTS_PATH : ${ROBOT_RESULTS_PATH} ${NC}"
fi
