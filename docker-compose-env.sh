#!/bin/bash
#set -xv

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
tput colors && source "${WORKING_DIR}/step-0-color.sh"

# shellcheck disable=SC2154
echo -e "${magenta} Make sure you have at least docker-compose==1.22.0 ${NC}"
# shellcheck disable=SC2154
echo -e "${green} pip install docker-compose==1.22.0 ${NC}"

if [ -n "${COMPOSE_HTTP_TIMEOUT}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} COMPOSE_HTTP_TIMEOUT is defined ${happy_smiley} : ${COMPOSE_HTTP_TIMEOUT} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : COMPOSE_HTTP_TIMEOUT, use the default one ${NC}"
  export COMPOSE_HTTP_TIMEOUT="200"
  echo -e "${magenta} COMPOSE_HTTP_TIMEOUT : ${COMPOSE_HTTP_TIMEOUT} ${NC}"
fi

if [ -n "${DOCKER_TEST_TAG}" ]; then
  DOCKER_TEST_TAG=$(echo "${DOCKER_TEST_TAG}" | tr '[:upper:]' '[:lower:]')
  export DOCKER_TEST_TAG
  # shellcheck disable=SC2154
  echo -e "${green} DOCKER_TEST_TAG is defined ${happy_smiley} : ${DOCKER_TEST_TAG} ${NC}"
else
  # shellcheck disable=SC2154
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_TEST_TAG, use the default one ${NC}"
  export DOCKER_TEST_TAG="test"
  echo -e "${magenta} DOCKER_TEST_TAG : ${DOCKER_TEST_TAG} ${NC}"
fi

if [ -n "${DOCKER_COMPOSE_FILE}" ]; then
  echo -e "${green} DOCKER_COMPOSE_FILE is defined ${happy_smiley} : ${DOCKER_COMPOSE_FILE} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_COMPOSE_FILE, use the default one ${NC}"
  export DOCKER_COMPOSE_FILE="docker-compose.dev.yml"
  echo -e "${magenta} DOCKER_COMPOSE_FILE : ${DOCKER_COMPOSE_FILE} ${NC}"
fi

if [ -n "${DOCKER_COMPOSE_OPTIONS}" ]; then
  echo -e "${green} DOCKER_COMPOSE_OPTIONS is defined ${happy_smiley} : ${DOCKER_COMPOSE_OPTIONS} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : DOCKER_COMPOSE_OPTIONS, use the default one ${NC}"
  export DOCKER_COMPOSE_OPTIONS="-p ${DOCKER_TEST_TAG}"
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
  export ROBOT_RESULTS_PATH="/tmp/robot-000-000"
  echo -e "${magenta} ROBOT_RESULTS_PATH : ${ROBOT_RESULTS_PATH} ${NC}"
fi

if [ -n "${TEST_RESULTS_PATH}" ]; then
  echo -e "${green} TEST_RESULTS_PATH is defined ${happy_smiley} : ${TEST_RESULTS_PATH} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : TEST_RESULTS_PATH, use the default one ${NC}"
  export TEST_RESULTS_PATH="/tmp/result"
  echo -e "${magenta} TEST_RESULTS_PATH : ${TEST_RESULTS_PATH} ${NC}"
fi

if [ -n "${JOB_NAME}" ]; then
  echo -e "${green} JOB_NAME is defined ${happy_smiley} : ${JOB_NAME} ${NC}"
else
  echo -e "${red} ${double_arrow} Undefined build parameter ${head_skull} : JOB_NAME, use the default one ${NC}"
  export JOB_NAME="TEST"
  echo -e "${magenta} JOB_NAME : ${JOB_NAME} ${NC}"
fi
