#!/bin/bash
#set -xv

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

source "${WORKING_DIR}/docker-compose-env.sh"

docker-compose -f "${WORKING_DIR}/docker-compose.yml" "${DOCKER_COMPOSE_OPTIONS}" down

exit 0
