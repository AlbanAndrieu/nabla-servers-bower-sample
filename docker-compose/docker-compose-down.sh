#!/bin/bash
#set -xv

WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-compose-env.sh"

# shellcheck disable=SC2154
echo -e "${green} Write logs in files ${NC}"
rm -f "${DOCKER_TEST_TAG}_*.docker.log"
for i in $(docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" "${DOCKER_COMPOSE_OPTIONS}" ps -q); do docker container logs --details "${i}" >&"./$(docker inspect --format="{{.Name}}" "${i}").docker.log"; done

if [ -n "${DEBUG_RUN}" ]; then
  echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml -f ${WORKING_DIR}/${DOCKER_COMPOSE_FILE} ${DOCKER_COMPOSE_OPTIONS} logs test ${NC}"
  # shellcheck disable=SC2086
  docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" ${DOCKER_COMPOSE_OPTIONS} logs test
fi

echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml -f ${WORKING_DIR}/${DOCKER_COMPOSE_FILE} ${DOCKER_COMPOSE_OPTIONS} down --volumes --rmi all --remove-orphans ${NC}"
# shellcheck disable=SC2086
docker-compose -f "${WORKING_DIR}/docker-compose.yml" -f "${WORKING_DIR}/${DOCKER_COMPOSE_FILE}" ${DOCKER_COMPOSE_OPTIONS} down --volumes

if [ -n "${CLEAN_RUN}" ]; then
  # ATTENTION: this will also remove volumes of docker-compose if the containers are barely stopped
  echo -e "${green} docker volume rm $(docker volume ls -qf dangling=true) ${NC}"
  docker volume rm "$(docker volume ls -qf dangling=true)"
fi

# shellcheck disable=SC2154
echo -e "${magenta} docker stop $(docker ps -a -q) ${NC}"
echo -e "${magenta} docker rm -v $(docker ps -aq -f 'status=exited') ${NC}"
echo -e "${magenta} docker rmi $(docker images -aq -f 'dangling=true') ${NC}"
echo -e "${magenta} docker volume prune ${NC}"

# docker system prune
# This will remove all unused containers, volumes, networks and images (both dangling and unreferenced).
# docker image prune

exit 0
