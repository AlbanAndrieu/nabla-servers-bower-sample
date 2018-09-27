#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

source "${WORKING_DIR}/docker-compose-env.sh"

echo "PATH : ${PATH}"

# shellcheck disable=SC2154
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} pull --ignore-pull-failures ${NC}"
docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" pull --ignore-pull-failures
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} up ${DOCKER_COMPOSE_UP_OPTIONS} ${NC}"
docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" up "${DOCKER_COMPOSE_UP_OPTIONS}"
#echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} up --exit-code-from robot robot ${NC}"
#docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" up --exit-code-from robot robot

sleep 10
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} logs frarc ${NC}"
docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" logs test
#echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} logs robot ${NC}"
#docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" logs robot

echo -e "${green} https://localhost:9009/"

exit 0
