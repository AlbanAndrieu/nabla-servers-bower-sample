#!/bin/bash
#set -xv
shopt -s extglob

#set -ueo pipefail
set -eo pipefail

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
tput colors && source "${WORKING_DIR}/../step-0-color.sh"

export DOCKER_NAME=$1
export DOCKER_NAME=${DOCKER_NAME:-"ansible-jenkins-slave-test"}

echo "DOCKER_NAME : $DOCKER_NAME"

export DOCKER_TAG=$2
#if [[ $DOCKER_TAG == "" ]]; then
#    echo "Missing DOCKER_TAG"
#fi

echo "DOCKER_TAG : $DOCKER_TAG"

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck source=/dev/null
source "${WORKING_DIR}/docker-env.sh"

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"  )" && pwd  )"

# shellcheck disable=SC2154
echo -e "${magenta} Using build image ${NC}"

echo -e ""
echo -e "${green} This image is a trusted docker Image. ${happy_smiley} ${NC}"
echo -e ""
echo -e "To use it on workstation"
echo -e "    docker login ${DOCKER_REGISTRY} --username ${DOCKER_USERNAME} --password password"
echo -e "    docker run -it -u 1004:999 -v /etc/passwd:/etc/passwd:ro -v /etc/group:/etc/group:ro -v /var/run/docker.sock:/var/run/docker.sock -w /sandbox/project-to-build -v ${WORKING_DIR}/../:/sandbox/project-to-build:rw -v /jenkins:/home/jenkins -v /data1/home/jenkins/.m2:/data1/home/jenkins/.m2 -v /etc/bash_completion.d:/etc/bash_completion.d:ro --name sandbox --entrypoint /bin/bash ${DOCKER_REGISTRY}${DOCKER_ORGANISATION}/${DOCKER_NAME}:${DOCKER_TAG}"
echo -e ""

exit 0
