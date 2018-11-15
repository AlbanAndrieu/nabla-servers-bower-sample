#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

source "${WORKING_DIR}/docker-compose-env.sh"

# shellcheck disable=SC2154
echo -e "${green} docker-compose -f ${WORKING_DIR}/docker-compose.yml ${DOCKER_COMPOSE_OPTIONS} down -v --remove-orphans ${NC}"
# shellcheck disable=SC2086
docker-compose -f "${WORKING_DIR}/docker-compose.yml" ${DOCKER_COMPOSE_OPTIONS} down -v --remove-orphans

echo -e "${green} docker stop $(docker ps -a -q) ${NC}"
echo -e "${green} docker rm -f $(docker ps -a -q) ${NC}"
echo -e "${green} docker images -q | xargs docker rmi -f ${NC}"
echo -e "${green} docker volume prune ${NC}"


exit 0
