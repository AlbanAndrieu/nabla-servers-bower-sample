#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-compose-env.sh"

if [ -n "${DEBUG_RUN}" ]; then
  docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" config
fi

if [ -z "${DRY_RUN}" ]; then
  # shellcheck disable=SC2154
  echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml -f ${WORKING_DIR}/${DOCKER_COMPOSE_FILE} ${DOCKER_COMPOSE_OPTIONS} pull --ignore-pull-failures ${NC}"
  # shellcheck disable=SC2086
  #docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" ${DOCKER_COMPOSE_OPTIONS} pull --ignore-pull-failures
fi
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml -f ${WORKING_DIR}/${DOCKER_COMPOSE_FILE} ${DOCKER_COMPOSE_OPTIONS} up ${DOCKER_COMPOSE_UP_OPTIONS} ${NC}"
# shellcheck disable=SC2086
docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" ${DOCKER_COMPOSE_OPTIONS} up ${DOCKER_COMPOSE_UP_OPTIONS}
RC=$?
if [ ${RC} -ne 0 ]; then
  echo ""
  # shellcheck disable=SC2154
  echo -e "${red} ${head_skull} Sorry, docker compose failed. ${NC}"
  exit 1
else
  echo -e "${green} The docker compose completed successfully. ${NC}"
fi

sleep 10
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml -f ${WORKING_DIR}/${DOCKER_COMPOSE_FILE} ${DOCKER_COMPOSE_OPTIONS} logs ${DOCKER_COMPOSE_UP_SERVICE} ${NC}"
# shellcheck disable=SC2086
docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" ${DOCKER_COMPOSE_OPTIONS} logs ${DOCKER_COMPOSE_UP_SERVICE}

echo -e "${green} http://localhost:9090/ ${NC}"

echo -e "${green} docker cp ${DOCKER_TEST_TAG}_web_1:${ALMTEST_RESULTS_PATH} result ${NC}"

exit 0
